const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
export const razorpayConfigured = Boolean(razorpayKeyId);

let scriptPromise;
function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = resolve; script.onerror = () => reject(new Error('Razorpay Checkout could not load.')); document.body.appendChild(script); });
  return scriptPromise;
}

export async function startRazorpayPayment(payload) {
  await loadRazorpayScript();
  const orderResponse = await fetch('/api/create-order', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
  const order = await orderResponse.json();
  if (!orderResponse.ok) throw new Error(order.error || 'Unable to start payment.');
  return new Promise((resolve) => {
    const checkout = new window.Razorpay({key: order.key_id, amount: order.amount, currency: order.currency, name: 'Best in Daman', description: 'Daman Board listing bid', order_id: order.order_id, prefill: {name: payload.owner_name, contact: payload.owner_contact}, theme: {color: '#4098f6'}, handler: async (response) => {
      try { const verification = await fetch('/api/verify-payment', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...response, listing_id: order.listing_id, bid_id: order.bid_id})}); const result = await verification.json(); resolve(verification.ok ? {ok: true, status: result.status} : {ok: false, error: result.error}); }
      catch { resolve({ok: false, error: 'Payment completed, but verification could not finish. Please contact support.'}); }
    }, modal: {ondismiss: () => resolve({ok: false, error: 'Payment was cancelled.'})}});
    checkout.open();
  });
}
