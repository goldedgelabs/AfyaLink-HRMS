
import express from 'express';
const router = express.Router();
import ai from './aiService.js';

router.post('/diagnose', async (req, res) => {
  try {
    const { symptoms } = req.body;
    const out = await ai.diagnose(symptoms);
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI error' });
  }
});

router.post('/treatment', async (req, res) => {
  try {
    const { condition } = req.body;
    const out = await ai.treatment(condition);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'AI error' });
  }
});

router.post('/discharge', async (req, res) => {
  try {
    const data = req.body;
    const out = await ai.discharge(data);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'AI error' });
  }
});

router.post('/triage', async (req, res) => {
  try {
    const { symptoms } = req.body;
    const out = await ai.triage(symptoms);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'AI error' });
  }
});

export default router;

// SSE chat streaming endpoint (simple placeholder stream)
router.post('/chat', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const { message } = req.body || {};
    // send simulated chunks
    const chunks = [
      JSON.stringify({ role: 'assistant', chunk: 'Thinking...' }),
      JSON.stringify({ role: 'assistant', chunk: 'Analyzing symptoms...' }),
      JSON.stringify({ role: 'assistant', chunk: 'Formulating response...' }),
      JSON.stringify({ role: 'assistant', chunk: 'Result: placeholder diagnosis.' })
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i >= chunks.length) {
        res.write('event: done\ndata: end\n\n');
        clearInterval(iv);
        res.end();
        return;
      }
      res.write(`data: ${chunks[i]}\n\n`);
      i++;
    }, 600);
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'AI chat error' });
  }
});
import multer from 'multer';
const upload = multer();
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const out = await require('./aiService').transcribe(buffer);
    res.json({ text: out.text || 'Transcription placeholder' });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Transcription failed' });
  }
});
