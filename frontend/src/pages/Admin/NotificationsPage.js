import React, {useState} from 'react';
export default function NotificationsPage(){
  const [to,setTo]=useState('');
  const [msg,setMsg]=useState('');
  const send = async ()=>{
    const res = await fetch('/api/notify/send', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({channel:'sms', provider:'twilio', to, message: msg})});
    const js = await res.json();
    alert(JSON.stringify(js));
  };
  return (<div><h1>Notifications</h1><input placeholder='to' value={to} onChange={e=>setTo(e.target.value)} /><br/><textarea value={msg} onChange={e=>setMsg(e.target.value)} /><br/><button onClick={send}>Send</button></div>);
}
