// workers/notificationWorker.js
import { Worker, Queue, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import { getSMSProvider, getWhatsAppProvider, getEmailProvider, sendPush } from '../notifications/index.js';

const { REDIS_URL } = process.env;
if (!REDIS_URL) {
  console.warn('REDIS_URL not set - worker will not connect automatically');
}

const connection = REDIS_URL ? new IORedis(REDIS_URL) : null;

// Example worker, listens to 'notifications' queue
const queueName = 'notifications';
let worker = null;

if (connection) {
  const scheduler = new QueueScheduler(queueName, { connection });
  worker = new Worker(queueName, async job => {
    const { type, provider, payload } = job.data;
    if (type === 'sms') {
      const sendSMS = getSMSProvider(provider);
      return await sendSMS(payload.to, payload.message);
    }
    if (type === 'whatsapp') {
      const sendWhats = getWhatsAppProvider(provider);
      return await sendWhats(payload.to, payload.message);
    }
    if (type === 'email') {
      const sendEmail = getEmailProvider();
      return await sendEmail(payload.to, payload.subject, payload.html, payload.text);
    }
    if (type === 'push') {
      return await sendPush(payload.subscription, payload.payload);
    }
    throw new Error('Unknown job type ' + type);
  }, { connection });
  console.log('Notification worker started');
} else {
  console.log('No REDIS_URL; worker idle');
}

export default worker;
