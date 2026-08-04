import EmailQueue from '../queues/emailQueue.ts';

async function EmailQueueProducer({
    jobName = 'email',
    data,
}: {
    jobName?: string;
    data: any;
}) {
    try {
        await EmailQueue.add(jobName, data);
    } catch (error) {
        console.error(`Error in EmailQueueProducer: ${error}`);
    }
}

export default EmailQueueProducer;
