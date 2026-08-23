import Razorpay from 'razorpay';
import { adminClient, json, readBody, requirePost } from './_server.js';

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  try {
    const body = await readBody(req);
    const {url, name, category, description, owner_name, owner_contact, amount} = body;
    if (!url || !name || !category || !description || !owner_name || !owner_contact || !Number.isInteger(amount) || amount < 49) return json(res, 400, {error: 'Complete the listing details and use a bid of at least ₹49.'});
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error('Razorpay server environment is not configured.');
    const supabase = adminClient();
    const {data: listing, error: listingError} = await supabase.from('listings').insert({url: url.trim(), name: name.trim(), category, description: description.trim(), owner_name: owner_name.trim(), owner_contact: owner_contact.trim(), current_bid: amount, status: 'pending'}).select('id').single();
    if (listingError) return json(res, listingError.code === '23505' ? 409 : 400, {error: listingError.code === '23505' ? 'This link is already on the board.' : listingError.message});
    const razorpay = new Razorpay({key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET});
    const order = await razorpay.orders.create({amount: amount * 100, currency: 'INR', receipt: `daman_${listing.id.slice(0, 8)}_${Date.now()}`, notes: {listing_id: listing.id}});
    const {data: bid, error: bidError} = await supabase.from('bids').insert({listing_id: listing.id, bidder_name: owner_name.trim(), bidder_contact: owner_contact.trim(), amount, payment_status: 'pending', razorpay_order_id: order.id}).select('id').single();
    if (bidError) throw bidError;
    return json(res, 200, {key_id: process.env.RAZORPAY_KEY_ID, order_id: order.id, amount: order.amount, currency: order.currency, listing_id: listing.id, bid_id: bid.id});
  } catch (error) { return json(res, 500, {error: error.message || 'Unable to create payment order.'}); }
}
