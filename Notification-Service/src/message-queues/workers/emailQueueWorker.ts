import { Worker } from 'bullmq';
import { Queues } from '../../config/index.config.ts';
import redisClient from '../../config/redis.config.ts';
import renderTemplate from '../../templates/template.handler.ts';
import { sendEmail } from '../../config/nodemailer.config.ts';

export default function EmailQueueWorker() {
    // Create a worker to process jobs from the email queue

    const worker = new Worker(
        Queues.EMAIL_QUEUE,
        async (job) => {
            if (job.name !== 'email') {
                return;
            }
            const { to, subject, templateId, params } = job.data;

            console.log(
                `Processing job ${job.id} of type ${job.name} with data:`,
                job.data,
            );

            const content = await renderTemplate(templateId, params);
            await sendEmail(to, subject, content);
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
