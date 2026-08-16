import RoomCategory from "../db/models/roomCategory.ts";
import { CrudRepository } from "./crud.repository.ts";


export class RoomCategoryRepository extends CrudRepository<RoomCategory> {
    constructor() {
        super(RoomCategory);
    }
}