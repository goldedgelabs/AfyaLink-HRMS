import React, {useState} from 'react';
import { apiFetch } from '../../services/api';

export default function Triage(){
  const [symptoms,setSymptoms]=useState('');
  const [res,setRes]=useState(null);
  const run = async ()=>{
    const r = await apiFetch('/api/triage/classify', { method:'POST', body:{ symptoms } });
    const j = await r.json();
    setRes(j);
  };
  return (<div><h2>Triage</h2><textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} rows={6} style={{width:'100%'}}></textarea><button onClick={run}>Classify</button><pre>{JSON.stringify(res,null,2)}</pre></div>);
}
