// routes/hotel.routes.ts
import { Router } from "express";
import HotelController from "../../controllers/hotel.controller.ts";
import { validate } from "../../utils/validators/index.ts";
import { hotelSchema } from "../../utils/validators/hotel.schema.ts";

const router = Router();
const hotelController = new HotelController();

router.post(
  "/",
  validate().body(hotelSchema).run(),
  hotelController.create,
);
router.get("/:id", hotelController.findById);

export default router;
