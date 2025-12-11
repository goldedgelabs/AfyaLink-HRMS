import React from 'react';

export default function PaymentsPage(){
  const call = async (provider) => {
    const res = await fetch('/api/payments/'+provider, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({amount:100})});
    const js = await res.json();
    alert(JSON.stringify(js));
  };
  return (<div>
    <h1>Payments</h1>
    <button onClick={()=>call('mpesa')}>M-Pesa</button>
    <button onClick={()=>call('stripe')}>Stripe</button>
    <button onClick={()=>call('flutterwave')}>Flutterwave</button>
  </div>);
}
