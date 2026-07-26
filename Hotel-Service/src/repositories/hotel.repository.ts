import Hotel from "../db/models/hotel.ts";
import { CrudRepository } from "./crud.repository.ts";

export class HotelRepository extends CrudRepository<Hotel> {
    constructor() {
        super(Hotel);
    }

    // hotel specific queries


}