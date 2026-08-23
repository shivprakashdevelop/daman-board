import crypto from 'node:crypto';
import { adminClient, json } from './_server.js';

export const config = {api: {bodyParser: false}};

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, {error: 'Method not allowed'});
  try {
    const raw = await new Promise((resolve, reject) => { let body = ''; req.on('data', (chunk) => { body += chunk; }); req.on('end', () => resolve(body)); req.on('error', reject); });
    const signature = req.headers['x-razorpay-signature'];
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '').update(raw).digest('hex');
    const expectedBuffer = Buffer.from(expected); const receivedBuffer = Buffer.from(signature || '');
    if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) return json(res, 400, {error: 'Invalid webhook signature.'});
    const event = JSON.parse(raw);
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) await adminClient().from('bids').update({payment_status: 'paid', razorpay_payment_id: payment.id}).eq('razorpay_order_id', payment.order_id);
    }
    return json(res, 200, {received: true});
  } catch (error) { return json(res, 500, {error: error.message || 'Webhook processing failed.'}); }
}
