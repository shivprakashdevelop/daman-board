import crypto from 'node:crypto';
import { adminClient, json, readBody, requirePost } from './_server.js';

function signaturesMatch(expected, received) {
  const expectedBuffer = Buffer.from(expected || '', 'utf8'); const receivedBuffer = Buffer.from(received || '', 'utf8');
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  try {
    const body = await readBody(req);
    const {listing_id, bid_id, razorpay_order_id, razorpay_payment_id, razorpay_signature} = body;
    if (!listing_id || !bid_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return json(res, 400, {error: 'Incomplete payment response.'});
    if (!process.env.RAZORPAY_KEY_SECRET) throw new Error('Razorpay server environment is not configured.');
    const supabase = adminClient();
    const {data: bid, error: bidError} = await supabase.from('bids').select('id, listing_id, razorpay_order_id, payment_status').eq('id', bid_id).eq('listing_id', listing_id).single();
    if (bidError || !bid) return json(res, 404, {error: 'Payment record not found.'});
    if (bid.razorpay_order_id !== razorpay_order_id) return json(res, 400, {error: 'Payment order mismatch.'});
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${bid.razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (!signaturesMatch(expected, razorpay_signature)) return json(res, 400, {error: 'Payment signature could not be verified.'});
    if (bid.payment_status !== 'paid') {
      const {error: updateError} = await supabase.from('bids').update({payment_status: 'paid', razorpay_payment_id, razorpay_signature}).eq('id', bid.id);
      if (updateError) throw updateError;
      await supabase.from('listing_events').insert({listing_id, event_type: 'bid_placed', metadata: {amount: 'verified', razorpay_payment_id}});
    }
    return json(res, 200, {ok: true, status: 'pending_moderation'});
  } catch (error) { return json(res, 500, {error: error.message || 'Unable to verify payment.'}); }
}
