import { Router } from 'express';
import BookingController from './booking.controller.ts';
const bookingRouter = Router();


const bookingController = new BookingController();

bookingRouter.post('/',bookingController.createBooking)
bookingRouter.post('/confirm/:idempotencyKey',bookingController.confirmBooking)

export default bookingRouter;
