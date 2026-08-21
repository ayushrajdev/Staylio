import type { CreationAttributes } from 'sequelize';
import Room from '../db/models/room.ts';
import { CrudRepository } from './crud.repository.ts';

export class RoomRepository extends CrudRepository<Room> {
    constructor() {
        super(Room);
    }

    // async findByRoomCategoryIdAndDate(
    //     roomCategoryId: number,
    //     currentDate: Date,
    // ) {
    //     return await this.model.findOne({
    //         where: {
    //             roomCategoryId,
    //             dateOfAvailability: currentDate,
    //             deletedAt: null,
    //         },
    //     });
    // }

    // async findAllByRoomCategoryIdAndDate(roomCategoryId: number, date: string) {
    //     return await this.model.findAll({
    //         where: {
    //             roomCategoryId,
    //             dateOfAvailability: date,
    //             deletedAt: null,
    //         },
    //         attributes: ['id'],
    //     });
    // }

    async bulkCreate(rooms: CreationAttributes<Room>[]) {
        return await this.model.bulkCreate(rooms);
    }


     /**
     * Get all rooms for a category on a specific calendar date.
     *
     * Example:
     *
     * roomCategoryId = 10
     * date = 2026-08-25
     *
     * Returns all Room rows for that category/date.
     */
    async findAllByRoomCategoryIdAndDate(
        roomCategoryId: number,
        date: string,
    ) {
        return await this.model.findAll({
            where: {
                roomCategoryId,
                dateOfAvailability: date,
                deletedAt: null,
            },
        });
    }

    /**
     * Find the latest date for which the category has
     * the COMPLETE number of rooms.
     *
     * Example:
     *
     * roomCount = 5
     *
     * 2026-08-25 -> 5 rooms
     * 2026-08-26 -> 5 rooms
     * 2026-08-27 -> 2 rooms
     *
     * This returns:
     *
     * 2026-08-26
     *
     * because 27th is incomplete.
     */
    async findLastCompleteDate(
        roomCategoryId: number,
        roomCount: number,
    ): Promise<string | null> {
        const [result] = await this.model.sequelize!.query(
            `
            SELECT date_of_availability AS "dateOfAvailability"
            FROM rooms
            WHERE room_category_id = :roomCategoryId
              AND deleted_at IS NULL
            GROUP BY date_of_availability
            HAVING COUNT(*) >= :roomCount
            ORDER BY date_of_availability DESC
            LIMIT 1
            `,
            {
                replacements: {
                    roomCategoryId,
                    roomCount,
                },
                type: 'SELECT',
            },
        );

        const row = result as {
            dateOfAvailability?: string;
        } | undefined;

        return row?.dateOfAvailability ?? null;
    }
}
