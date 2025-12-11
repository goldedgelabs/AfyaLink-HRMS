/* CRDT models - wrappers around Automerge docs stored in CRDT store
   Each resource is represented as a key in a shared Automerge doc:
   docId: 'afya:patients' -> doc.patients = { <id>: { firstName, lastName, ... } }
*/
import Automerge from 'automerge';
import { loadDoc, saveDoc } from '../services/crdtStore.js';

export async function loadPatientsDoc(){
  return await loadDoc('afya:patients');
}

export async function savePatientsDoc(doc){
  return await saveDoc('afya:patients', doc);
}

export async function createPatientCRDT(data){
  let doc = await loadPatientsDoc();
  // Automerge.change requires the doc object; if loadDoc returned binary? assume Automerge doc
  const newDoc = Automerge.change(doc, 'create patient', d=>{ if(!d.patients) d.patients = {}; const id = data.id || ('p_'+Date.now()); d.patients[id] = data; });
  await savePatientsDoc(newDoc);
  return newDoc;
}

export async function listPatientsCRDT(){
  const doc = await loadPatientsDoc();
  return doc.patients || {};
}
