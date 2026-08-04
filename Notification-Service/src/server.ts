import express from 'express';
import { loadEnv } from './config/index.config.ts';
import logger from './config/logger.config.ts';
import router from './index.router.ts';
import redisClient from './config/redis.config.ts';
import EmailQueue from './message-queues/queues/emailQueue.ts';
import { attachCorrelationId } from './common/middlewares/correlation.middleware.ts';
import { genericErrorHandler } from './common/middlewares/error.middleware.ts';
import EmailQueueWorker from './message-queues/workers/emailQueueWorker.ts';
import EmailQueueProducer from './message-queues/producers/emailQueueProducer.ts';

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(attachCorrelationId);

app.use('/api/v1', router);

app.use(genericErrorHandler);
redisClient
    .connect()
    .then(() => {
        console.log('Redis client connected');

        EmailQueueProducer({
            jobName: 'email',
            data: {
                to: 'user@example.com',
                subject: 'Test Email',
                templateId: 'test-template',
                params: { name: 'John Doe' }
            }
        });
        EmailQueueWorker();
        app.listen(3000, () => {
            // EmailQueue.add('sendEmail', {
            //     to: 'user@example.com',
            //     subject: 'Test Email',
            //     body: 'This is a test email.',
            // });
            loadEnv();
            console.log('started the server');
        });
    })
    .catch((err) => {
        console.log('Redis client error:', err.message);
    });
