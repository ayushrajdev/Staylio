import { Worker } from 'bullmq';
import { Queues } from '../../config/index.config.ts';
import redisClient from '../../config/redis.config.ts';

export default function EmailQueueWorker() {
    // Create a worker to process jobs from the email queue

    const worker = new Worker(
        Queues.EMAIL_QUEUE,
        async (job) => {
            if (job.name !== 'email') {
                return;
            }
            const { to, subject,  } = job.data;
            console.log(
                `Processing job ${job.id} of type ${job.name} with data:`,
                job.data,
            );

            // call the service layer
        },
        {
            connection: redisClient,
        },
    );

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job?.id} has failed with ${err.message}`);
    });
}
