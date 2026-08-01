import type { Request, Response } from 'express';
import BookingService from './booking.service.ts';

export default class BookingController {
    bookingService = new BookingService();

    createBooking = async (req: Request, res: Response) => {
        const { booking, idempotencyKey } =
            await this.bookingService.createBooking(
                req.body.userId,
                req.body.hotelId,
            );

        res.status(201).json({ booking, idempotencyKey });
    };

    confirmBooking = async (req: Request, res: Response) => {
        const confirmedBooking =
            await this.bookingService.confirmBooking(
                req.params.idempotencyKey as string,
            );

        res.status(200).json({ confirmedBooking });
    };
}
