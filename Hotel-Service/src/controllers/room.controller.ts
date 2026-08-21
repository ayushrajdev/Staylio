import type { Request, Response } from 'express';
import RoomService from '../services/room.service.ts';
import RoomQueueProducer from '../message-queues/producers/RoomQueueProducer.ts';
import type {
    RoomGenerationJob,
    RoomGenerationJobSchema,
} from '../dtos/room.dto.ts';
import { z } from 'zod';

export default class RoomController {
    constructor() {}

    async generateRoomHandler(req: Request, res: Response): Promise<void> {
        try {
            RoomQueueProducer(req.body as RoomGenerationJob);

            res.status(200).json({
                message: 'Room generation job added to queue',
                success: true,
                data: {},
            });
        } catch (error) {
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                data: {},
                errors: error,
            });
        }
    }
}
