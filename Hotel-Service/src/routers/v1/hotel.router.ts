// routes/hotel.routes.ts

import { Router } from "express";
import HotelController from "../../controllers/hotel.controller.ts";
import { validate } from "../../utils/validators/index.ts";
import { hotelSchema } from "../../utils/validators/hotel.schema.ts";

const router = Router();
const hotelController = new HotelController();

router
    .route("/")
    .post(
        validate().body(hotelSchema).run(),
        hotelController.create,
    )
    .get(hotelController.findAll);

router
    .route("/:id")
    .get(hotelController.findById)
    .put(hotelController.update)
    .delete(hotelController.delete);

export default router;