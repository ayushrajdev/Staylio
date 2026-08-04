import express from 'express';
import { loadEnv } from './config/index.config.ts';
import router from './index.router.ts';
import redisClient from './config/redis.config.ts';
import { attachCorrelationId } from './common/middlewares/correlation.middleware.ts';
import { genericErrorHandler } from './common/middlewares/error.middleware.ts';
import EmailQueueWorker from './message-queues/workers/emailQueueWorker.ts';
import transporter from './config/nodemailer.config.ts';

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
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP Error:', error);
            } else {
                console.log('SMTP Server Ready');
            }
        });

        EmailQueueWorker();
        app.listen(3000, () => {
            loadEnv();
            console.log('started the server');
        });
    })
    .catch((err) => {
        console.log('Redis client error:', err.message);
    });
