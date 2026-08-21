import type { CreationAttributes } from 'sequelize';
import logger from '../config/logger.config.ts';
import RoomCategory from '../db/models/roomCategory.ts';
import type { RoomGenerationJob } from '../dtos/room.dto.ts';
import { RoomCategoryRepository } from '../repositories/roomCategory.repository.ts';
import { CrudService } from './crud.service.ts';
import Room from '../db/models/room.ts';
import { RoomRepository } from '../repositories/room.repository.ts';

export default class RoomService extends CrudService<RoomCategoryRepository> {
    private roomCategoryRepository: RoomCategoryRepository;
    private roomRepository: RoomRepository;

    constructor() {
        super(new RoomCategoryRepository());

        this.roomCategoryRepository = new RoomCategoryRepository();
        this.roomRepository = new RoomRepository();
    }

    async generateRoomsByJob(jobData: RoomGenerationJob) {
        let totalRoomsCreated = 0;
        let totalDatesProcessed = 0;

        const roomCategory = await this.roomCategoryRepository.findById(
            jobData.roomCategoryId,
        );

        if (!roomCategory) {
            throw new Error(
                `Room category with ID ${jobData.roomCategoryId} not found`,
            );
        }

        if (roomCategory.roomCount < 1) {
            throw new Error(
                `Room category ${roomCategory.id} has invalid roomCount`,
            );
        }

        const startDate = jobData.startDate;
        const endDate = jobData.endDate;

        if (!isValidDateOnly(startDate)) {
            throw new Error(
                `Invalid startDate: ${startDate}. Expected YYYY-MM-DD`,
            );
        }

        if (!isValidDateOnly(endDate)) {
            throw new Error(`Invalid endDate: ${endDate}. Expected YYYY-MM-DD`);
        }

        if (startDate > endDate) {
            throw new Error('Start date must be before or equal to end date');
        }

        const today = getTodayDateOnly();

        if (startDate < today) {
            throw new Error('Start date must be today or in the future');
        }

        const batchSize = jobData.batchSize || 100;

        let currentDate = startDate;

        while (currentDate <= endDate) {
            let batchEndDate = addDays(currentDate, batchSize - 1);

            if (batchEndDate > endDate) {
                batchEndDate = endDate;
            }

            const batchResult = await this.processDateBatch(
                roomCategory,
                currentDate,
                batchEndDate,
                jobData.priceOverride,
            );

            totalRoomsCreated += batchResult.roomsCreated;
            totalDatesProcessed += batchResult.datesProcessed;

            currentDate = addDays(batchEndDate, 1);
        }

        logger.info(
            `Room generation completed. Dates processed: ${totalDatesProcessed}, rooms created: ${totalRoomsCreated}`,
        );

        return {
            totalRoomsCreated,
            totalDatesProcessed,
        };
    }

    async processDateBatch(
        roomCategory: RoomCategory,
        startDate: string,
        endDate: string,
        priceOverride?: number,
    ) {
        let roomsCreated = 0;
        let datesProcessed = 0;

        const roomsToCreate: CreationAttributes<Room>[] = [];

        let currentDate = startDate;

        while (currentDate <= endDate) {
            const existingRooms =
                await this.roomRepository.findAllByRoomCategoryIdAndDate(
                    roomCategory.id,
                    currentDate,
                );

            const existingRoomCount = existingRooms.length;

            const roomsNeeded = roomCategory.roomCount - existingRoomCount;

            logger.info(
                `${currentDate}: existing=${existingRoomCount}, required=${roomCategory.roomCount}, creating=${Math.max(
                    roomsNeeded,
                    0,
                )}`,
            );

            if (roomsNeeded > 0) {
                for (let i = 0; i < roomsNeeded; i++) {
                    roomsToCreate.push({
                        hotelId: roomCategory.hotelId,
                        roomCategoryId: roomCategory.id,
                        dateOfAvailability: currentDate,
                        price:
                            priceOverride !== undefined
                                ? priceOverride
                                : roomCategory.price,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                    });
                }
            }

            datesProcessed++;

            currentDate = addDays(currentDate, 1);
        }

        if (roomsToCreate.length > 0) {
            logger.info(`Creating ${roomsToCreate.length} rooms`);

            await this.roomRepository.bulkCreate(roomsToCreate);

            roomsCreated = roomsToCreate.length;
        }

        return {
            roomsCreated,
            datesProcessed,
        };
    }
}

function isValidDateOnly(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const parts = value.split('-');

    if (parts.length !== 3) {
        return false;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day)
    ) {
        return false;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function addDays(dateString: string, days: number): string {
    const parts = dateString.split('-');

    if (parts.length !== 3) {
        throw new Error(`Invalid date format: ${dateString}`);
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const date = new Date(Date.UTC(year, month - 1, day));

    date.setUTCDate(date.getUTCDate() + days);

    return date.toISOString().slice(0, 10);
}
/**
 * Current calendar date as YYYY-MM-DD.
 */
function getTodayDateOnly(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const roomService = new RoomService();

export { roomService };
