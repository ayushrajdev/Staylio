import type { RoomGenerationJob } from "../../dtos/room.dto.ts";
import RoomQueue from "../queues/RoomQueue.ts";

async function RoomQueueProducer(data: RoomGenerationJob) {
    try {
        await RoomQueue.add('room', data);
    } catch (error) {
        console.error(`Error in RoomQueueProducer: ${error}`);
    }
}

export default RoomQueueProducer;
