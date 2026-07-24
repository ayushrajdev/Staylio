import { Router } from 'express';
import pingRouter from './ping.router.ts';
import hotelRouter from './hotel.router.ts';
const v1Router = Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/hotels', hotelRouter);

export default v1Router;
