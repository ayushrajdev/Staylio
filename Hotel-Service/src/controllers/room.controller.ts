import type { Request, Response } from 'express';
import RoomService from '../services/room.service.ts';
import RoomQueueProducer from '../message-queues/producers/RoomQueueProducer.ts';
import type {
    RoomGenerationJob,
    RoomGenerationJobSchema,
} from '../dtos/room.dto.ts';
import { z } from 'zod';
import RoomCategoryService from '../services/roomCategory.service.ts';

export default class RoomController {
    private roomCategoryService: RoomCategoryService;
    constructor() {
        this.roomCategoryService = new RoomCategoryService();
    }

    async generateRoomHandler(req: Request, res: Response): Promise<void> {
        try {
            // const roomcategory = this.roomCategoryService.findById(
            //     req.body.roomCategoryId,
            // );
            // req.body.noOfRooms = roomcategory.roomCount;
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
