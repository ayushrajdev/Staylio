import { Router } from 'express';
import pingRouter from './ping.router.ts';
import hotelRouter from './hotel.router.ts';
import roomRouter from './room.router.ts';
const v1Router:Router = Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/hotels', hotelRouter);
v1Router.use('/rooms', roomRouter);


export default v1Router;
