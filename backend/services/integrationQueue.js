import Queue from 'bull';
const REDIS = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// main integration queue with attempts and exponential backoff
export const integrationQueue = new Queue('integration-queue', REDIS, {
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 }, // 1s -> exp
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Dead-letter queue for jobs that exhaust retries
export const integrationDLQ = new Queue('integration-dlq', REDIS, {
  defaultJobOptions: { removeOnComplete: true, removeOnFail: false }
});

// When a job fails and exhausted attempts, move to DLQ
integrationQueue.on('failed', async (job, err) => {
  try {
    if (job.attemptsMade >= (job.opts.attempts || 5)) {
      // move payload to DLQ with failure reason
      await integrationDLQ.add({ originalJob: job.data, failedReason: err.message, stack: err.stack });
      await job.remove();
      console.error('Job moved to DLQ', job.id, err.message);
    }
  } catch (e) {
    console.error('Error moving job to DLQ', e);
  }
});

export default { integrationQueue, integrationDLQ };
