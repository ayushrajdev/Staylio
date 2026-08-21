import express from 'express';
import RoomController from '../../controllers/room.controller.ts';
import { validate } from '../../utils/validators/index.ts';
import { RoomGenerationJobSchema } from '../../dtos/room.dto.ts';

const router = express.Router();
const roomController = new RoomController();
router.post(
    '/',
    validate().body(RoomGenerationJobSchema).run(),
    roomController.generateRoomHandler,
);

export default router;
