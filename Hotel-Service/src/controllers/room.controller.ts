import type { Request, Response } from "express";
import RoomService from "../services/room.service.ts";

class RoomController {
    private roomService: RoomService;
    constructor() {
        this.roomService = new RoomService();

    }

    async generateRoomHandler(req: Request, res: Response):Promise<void> {


    // await addRoomGenerationJobToQueue(req.body);

       res.status(200).json({
        message: "Room generation job added to queue",
        success: true,
        data: {},
    })
}
}