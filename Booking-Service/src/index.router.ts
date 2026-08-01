import { Router } from 'express';
import bookingRouter from './modules/booking/booking.router.ts';
const v1Router = Router();



v1Router.use('/bookings',bookingRouter)

export default v1Router;
