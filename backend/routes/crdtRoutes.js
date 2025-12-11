import express from 'express';
import { loadDoc, saveDoc, applyChanges } from '../services/crdtStore.js';
import Automerge from 'automerge';
const router = express.Router();

// Get full doc (base64 encoded binary)
router.get('/:docId', async (req,res)=>{
  try{
    const doc = await loadDoc(req.params.docId);
    const bin = Automerge.save(doc);
    res.json({ ok:true, bin: Buffer.from(bin).toString('base64') });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

// Push changes (client sends base64-encoded changes array)
router.post('/:docId/changes', async (req,res)=>{
  try{
    const { changes } = req.body; // array of base64 strings representing Automerge changes
    const doc = await loadDoc(req.params.docId);
    const changesBufs = (changes||[]).map(c=>Buffer.from(c, 'base64'));
    const newDoc = applyChanges(doc, changesBufs);
    await saveDoc(req.params.docId, newDoc);
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

export default router;
