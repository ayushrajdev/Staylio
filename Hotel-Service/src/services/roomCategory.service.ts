import RoomCategory from '../db/models/roomCategory.ts';
import { RoomCategoryRepository } from '../repositories/roomCategory.repository.ts';
import { CrudService } from './crud.service.ts';

export default class RoomCategoryService extends CrudService<RoomCategoryRepository> {
    constructor() {
        super(new RoomCategoryRepository());
    }
}
