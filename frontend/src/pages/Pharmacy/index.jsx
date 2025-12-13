
import React, { useState } from 'react';

export default function Pharmacy() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const addItem = () => {
    if (!name || !qty) return;
    setItems([...items, { name, qty }]);
    setName('');
    setQty('');
  };

  return (
    <div style={{padding:20}}>
      <h2>Pharmacy Inventory</h2>
      <input placeholder="Medicine" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)} />
      <button onClick={addItem}>Add</button>

      <table border="1" cellPadding="5" style={{marginTop:20}}>
        <thead>
          <tr><th>Medicine</th><th>Quantity</th></tr>
        </thead>
        <tbody>
          {items.map((i, idx)=>(
            <tr key={idx}><td>{i.name}</td><td>{i.qty}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
