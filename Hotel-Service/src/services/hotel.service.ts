import { HotelRepository } from "../repositories/hotel.repository.ts";
import { CrudService } from "./crud.service.ts";

export default class HotelService extends CrudService<HotelRepository> {
    constructor() {
        super(new HotelRepository());
    }



}