import { Queue } from 'bullmq';
import { Queues } from '../../config/index.config.ts';

const RoomQueue = new Queue(Queues.ROOM_QUEUE);

export default RoomQueue;
