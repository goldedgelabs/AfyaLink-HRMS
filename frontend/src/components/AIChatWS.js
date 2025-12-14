import React, { useEffect, useRef, useState } from 'react';

export default function AIChatWS({ token }) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const url = (process.env.REACT_APP_WS_BASE || '') + '/ws/ai?token=' + encodeURIComponent(token || '');
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => setMessages(m => [...m, { from: 'sys', text: 'connected' }]);
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'chunk') {
          setMessages(m => [...m, { from: 'ai', text: data.data }]);
        } else if (data.event === 'done') {
          setMessages(m=>[...m,{from:'ai',text: JSON.stringify(data.data)}]);
        } else if (data.event === 'status') {
          setMessages(m => [...m, { from: 'sys', text: data.data }]);
        } else {
          setMessages(m => [...m, { from: 'raw', text: e.data }]);
        }
      } catch (err) {
        setMessages(m=>[...m,{from:'raw',text:e.data}]);
      }
    };
    ws.onclose = () => setMessages(m=>[...m,{from:'sys',text:'disconnected'}]);
    return () => ws.close();
  }, [token]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { type: 'diagnose', symptoms: input };
    wsRef.current.send(JSON.stringify(msg));
    setMessages(m => [...m, { from: 'user', text: input }]);
    setInput('');
  };

  return (<div>
    <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #eee', padding: 8 }}>
      {messages.map((m,i)=><div key={i} style={{ margin:6, background: m.from==='ai'? '#eef':'#dfd', padding:8, borderRadius:6 }}>{m.text}</div>)}
    </div>
    <div style={{marginTop:8, display:'flex', gap:8}}>
      <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1}} />
      <button onClick={send}>Ask AI</button>
    </div>
  </div>);
}
