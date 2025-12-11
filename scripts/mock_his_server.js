// Mock HIS server to demo webhooks to AfyaLink
import express from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';

const app = express();
app.use(express.text({ type: '*/*' }));

app.post('/send-hl7/:connectorId', async (req,res)=>{
  const connectorId = req.params.connectorId;
  const secret = process.env.MOCK_CONNECTOR_SECRET || 'mocksecret';
  const body = req.body;
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const url = (process.env.AFYA_URL || 'http://localhost:4000') + '/api/integrations/webhook/' + connectorId;
  const r = await fetch(url, { method:'POST', headers:{ 'X-AFYA-SIGNATURE': sig, 'Content-Type':'text/plain' }, body });
  const txt = await r.text();
  res.send({ status: r.status, text: txt });
});

app.listen(5002, ()=> console.log('Mock HIS running on http://localhost:5002'));
