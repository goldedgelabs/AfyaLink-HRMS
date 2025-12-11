// E2E CRDT test: two simulated clients create changes and sync via server changes endpoint
import fetch from 'node-fetch';
import Automerge from 'automerge';
const SERVER = process.env.SERVER || 'http://localhost:4000';

async function run(){
  // client A creates doc
  let docA = Automerge.init();
  docA = Automerge.change(docA, doc=>{ doc.patients = {}; doc.patients['a1'] = { firstName:'Alice' }; });
  const changesA = Automerge.getAllChanges(docA);
  const b64 = changesA.map(c=> Buffer.from(c).toString('base64'));
  await fetch(SERVER + '/api/crdt/testdoc/changes', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ changes: b64 }) });
  console.log('Client A pushed changes');

  // client B pulls, makes change, pushes
  const pull = await fetch(SERVER + '/api/crdt/testdoc'); const js = await pull.json();
  const bin = Buffer.from(js.bin, 'base64');
  let docB = Automerge.load(bin);
  docB = Automerge.change(docB, d=>{ d.patients['b1'] = { firstName:'Bob' }; });
  const changesB = Automerge.getAllChanges(docB);
  const b64b = changesB.map(c=> Buffer.from(c).toString('base64'));
  await fetch(SERVER + '/api/crdt/testdoc/changes', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ changes: b64b }) });
  console.log('Client B pushed changes');

  // client A pulls and merges
  const pull2 = await fetch(SERVER + '/api/crdt/testdoc'); const js2 = await pull2.json();
  const bin2 = Buffer.from(js2.bin, 'base64');
  let docA2 = Automerge.load(bin2);
  console.log('Final doc entries:', Object.keys(docA2.patients||{}));
}

run().catch(e=>{ console.error(e); process.exit(1); });
