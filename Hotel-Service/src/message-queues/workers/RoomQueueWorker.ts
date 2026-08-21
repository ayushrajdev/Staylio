import { Worker } from 'bullmq';
import { Queues } from '../../config/index.config.ts';
import redisClient from '../../config/redis.config.ts';
import { roomService } from '../../services/room.service.ts';

export default function RoomQueueWorker() {
    // Create a worker to process jobs from the email queue

    const worker = new Worker(
        Queues.ROOM_QUEUE,
        async (job) => {
            try {
                if (job.name !== 'room') {
                    return;
                }
    
                console.log(
                    `Processing job ${job.id} of type ${job.name} with data:`,
                    job.data,
                );
    
                roomService.generateRoomsByJob(job.data)
            } catch (error) {
                console.table(error);

            }

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
