// controllers/hotel.controller.ts
import type { Request, Response, NextFunction } from 'express';
import HotelService from '../services/hotel.service.ts'; // Adjust path as needed
import type { CreateHotelDto } from '../dtos/hotel.dto.ts';

export default class HotelController {
    private hotelService: HotelService;

    constructor() {
        this.hotelService = new HotelService();
    }

    /**
     * POST /hotels
     * Creates a new hotel record
     */
    create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const createHotelDto: CreateHotelDto = req.body;
            const newHotel = await this.hotelService.create(createHotelDto);

            res.status(201).json({
                success: true,
                message: 'Hotel created successfully',
                data: newHotel,
            });
        } catch (error) {
            next(error); // Forwards database or validation errors to your Express error handler
        }
    };

    /**
     * GET /hotels/:id
     * Retrieves a single hotel by its unique numeric ID
     */
    findById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const hotelId = Number(req.params.id);

            if (isNaN(hotelId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid hotel ID format',
                });
                return;
            }

            const hotel = await this.hotelService.findById(hotelId);

            if (!hotel) {
                res.status(404).json({
                    success: false,
                    message: `Hotel with ID ${hotelId} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: hotel,
            });
        } catch (error) {
            next(error);
        }
    };
}
