import API_BASE from "@/config/api";
import React, {useState} from 'react';

export default function PaymentsPageFull(){
  const [amount, setAmount] = useState(100);
  async function payStripe(){
    const res = await fetch(${API_BASE}//payments/stripe/create-payment-intent', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ amount }) });
    const js = await res.json();
    if (js.error) return alert(js.error);
    alert('Client secret: ' + js.clientSecret + '\n(Use Stripe.js on frontend to complete payment)');
  }
  async function payMpesa(){
    const res = await fetch(${API_BASE}//payments/mpesa/stk', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ amount, phone: '2547XXXXXXXX' }) });
    const js = await res.json(); alert(JSON.stringify(js));
  }
  return (<div>
    <h2>Payments</h2>
    <div><label>Amount: </label><input value={amount} onChange={e=>setAmount(e.target.value)} /></div>
    <button onClick={payStripe}>Pay with Stripe (create intent)</button>
    <button onClick={payMpesa}>Pay with M-Pesa (STK push)</button>
  </div>);
}
