import EmailQueue from '../queues/emailQueue.ts';

async function EmailQueueProducer(data: any) {
    try {
        await EmailQueue.add('email', data);
    } catch (error) {
        console.error(`Error in EmailQueueProducer: ${error}`);
    }
}

export default EmailQueueProducer;
