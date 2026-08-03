import type { NextFunction, Request, Response } from 'express';
import BookingService from './booking.service.ts';

export default class BookingController {
    bookingService = new BookingService();

    createBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);

            const { booking, idempotencyKey } =
                await this.bookingService.createBooking(
                    req.body.userId,
                    req.body.hotelId,
                );

            res.status(201).json({ booking, idempotencyKey });
        } catch (error) {
            next(error);
            console.error('Error in createBooking:', error);
        }
    };

    confirmBooking = async (req: Request, res: Response) => {
        const confirmedBooking = await this.bookingService.confirmBooking(
            req.params.idempotencyKey as string,
        );

        res.status(200).json({ confirmedBooking });
    };
}
