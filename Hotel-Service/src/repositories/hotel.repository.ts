import Hotel from "../db/models/hotel.ts";
import { CrudRepository } from "./Crud.repository.ts";

export class HotelRepository extends CrudRepository<Hotel> {
    constructor() {
        super(Hotel);
    }

    // hotel specific queries

    async findByLocation(location: string) {
        return this.model.findAll({
            where: {
                location,
            },
        });
    }
}