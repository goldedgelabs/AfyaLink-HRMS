// Mock HIS server to demo webhook pushes to AfyaLink
import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
const app = express();
app.use(express.json());
app.get('/', (req,res)=> res.send('Mock HIS running'));
app.post('/send-hl7', async (req,res)=>{
  const { target, secret } = req.body;
  const message = 'MSH|^~\\&|HIS|HOSP|...\rPID|1||12345||Doe^John||19800101|M|||123 Main St^^City^ST^12345||+254700000000\r';
  const sig = crypto.createHmac('sha256', secret).update(message).digest('hex');
  const r = await fetch(target, { method:'POST', headers:{ 'X-AFYA-SIGNATURE': sig, 'Content-Type':'text/plain' }, body: message });
  const js = await r.text();
  res.send(js);
});
app.post('/send-fhir', async (req,res)=>{
  const { target, secret } = req.body;
  const resource = { resourceType:'Patient', id:'ext-1', name:[{ family:'Doe', given:['John']}], gender:'male', birthDate:'1980-01-01' };
  const payload = JSON.stringify(resource);
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const r = await fetch(target, { method:'POST', headers:{ 'X-AFYA-SIGNATURE': sig, 'Content-Type':'application/json' }, body: payload });
  const js = await r.text();
  res.send(js);
});
app.listen(4005, ()=> console.log('Mock HIS running on 4005'));
