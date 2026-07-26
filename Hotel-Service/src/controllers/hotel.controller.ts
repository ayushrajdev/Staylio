import HotelService from "../services/hotel.service.ts";
import { CrudController } from "./curd.controller.ts";

export default class HotelController extends CrudController<HotelService> {
    constructor() {
        super(new HotelService());
    }


    // hotel specific endpoints

    
}