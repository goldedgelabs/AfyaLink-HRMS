// E2E CRDT simulation: two clients create local Automerge docs, make conflicting edits, push changes to server and fetch merged result.
// Requires node environment with automerge and node-fetch.
import Automerge from 'automerge';
import fetch from 'node-fetch';

const SERVER = process.env.SERVER || 'http://localhost:4000';
const docId = 'patient:demo-1';

async function pushChanges(changes){
  const b64 = changes.map(c=> Buffer.from(c).toString('base64'));
  await fetch(`${SERVER}/api/crdt/${docId}/changes`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ changes: b64 }) });
}

async function pull(){
  const r = await fetch(`${SERVER}/api/crdt/${docId}`);
  const js = await r.json();
  const bin = Buffer.from(js.bin, 'base64');
  return Automerge.load(bin);
}

(async ()=>{
  // client A
  let a = Automerge.init();
  a = Automerge.change(a, doc=>{ doc.name = 'Alice'; doc.vitals = { bp: '120/80' }; });
  const aChanges = Automerge.getAllChanges(a);
  await pushChanges(aChanges);
  console.log('client A pushed');

  // client B offline: starts from initial server state (simulate by pulling initial)
  let serverDoc = await pull();
  let b = serverDoc || Automerge.init();
  b = Automerge.change(b, doc=>{ doc.name = 'Alicia'; doc.vitals = { hr: 78 }; });
  const bChanges = Automerge.getAllChanges(b);
  await pushChanges(bChanges);
  console.log('client B pushed');

  // server final state
  const final = await pull();
  console.log('Final merged doc:', final);
})();
