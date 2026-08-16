import RoomCategoryService from '../services/roomCategory.service.ts';
import { CrudController } from './curd.controller.ts';

export default class RoomCategoryController extends CrudController<RoomCategoryService> {
    constructor() {
        super(new RoomCategoryService());
    }
}
