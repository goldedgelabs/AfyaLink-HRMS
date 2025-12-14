import React, {useEffect, useState} from 'react';

export default function AdminDashboard(){
  const [data, setData] = useState(null);
  useEffect(()=>{
    fetch('/api/analytics').then(r=>r.json()).then(setData).catch(()=>{});
  },[]);
  return (<div>
    <h1>Admin Dashboard</h1>
    <p>Overview and analytics (placeholders)</p>
    <pre>{JSON.stringify(data,null,2)}</pre>
  </div>);
}
