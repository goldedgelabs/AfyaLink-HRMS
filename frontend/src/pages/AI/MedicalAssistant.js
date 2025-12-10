import React, {useState} from 'react';
import { diagnose } from '../../services/aiClient';
export default function MedicalAssistant(){
  const [symptoms,setSymptoms]=useState('');
  const [result,setResult]=useState(null);
  const run = async ()=> {
    const res = await diagnose(symptoms);
    setResult(res);
  };
  return (<div>
    <h2>AI Medical Assistant (placeholder)</h2>
    <textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} rows={6} style={{width:'100%'}} />
    <button onClick={run}>Diagnose</button>
    <pre>{JSON.stringify(result,null,2)}</pre>
  </div>);
}
