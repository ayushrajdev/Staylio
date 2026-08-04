import { Queue } from 'bullmq';
import { Queues } from '../../config/index.config.ts';

const EmailQueue = new Queue(Queues.EMAIL_QUEUE);

export default EmailQueue;
