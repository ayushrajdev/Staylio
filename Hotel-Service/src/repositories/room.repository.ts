import { CreationAttributes } from 'sequelize';
import Room from '../db/models/room.ts';
import { CrudRepository } from './crud.repository.ts';

export class RoomRepository extends CrudRepository<Room> {
    constructor() {
        super(Room);
    }

    async findByRoomCategoryIdAndDate(
        roomCategoryId: number,
        currentDate: Date,
    ) {
        return await this.model.findOne({
            where: {
                roomCategoryId,
                dateOfAvailability: currentDate,
                deletedAt: null,
            },
        });
    }

    async bulkCreate(rooms: CreationAttributes<Room>[]) {
        
        return await this.model.bulkCreate(rooms);
    }
}
