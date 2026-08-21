import type { CreationAttributes } from 'sequelize';
import logger from '../config/logger.config.ts';
import RoomCategory from '../db/models/roomCategory.ts';
import type {
    RoomGenerationJob,
    RoomGenerationRequest,
} from '../dtos/room.dto.ts';
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
        console.log(`Room category: ${roomCategory}`)
        if (!roomCategory) {
            throw new Error(
                `Room category with ID ${jobData.roomCategoryId} not found`,
            );
        }
        const startDate = new Date(jobData.startDate);
        const endDate = new Date(jobData.endDate);

        if (startDate >= endDate) {
            console.error(`Start date must be before end date`);
            throw new Error(`Start date must be before end date`);
        }

        if (startDate < new Date()) {
            console.error(`Start date must be in the future`);
            throw new Error(`Start date must be in the future`);
        }

        const totalDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        logger.info(`Generating rooms for ${totalDays} days`);

        const batchSize = jobData.batchSize || 100; // put it in env variable or a some config

        const currentDate = new Date(startDate);

        while (currentDate < endDate) {
            const batchEndDate = new Date(currentDate);

            batchEndDate.setDate(batchEndDate.getDate() + batchSize);

            if (batchEndDate > endDate) {
                batchEndDate.setTime(endDate.getTime());
            }

            const batchResult = await this.processDateBatch(
                roomCategory,
                currentDate,
                batchEndDate,
                jobData.priceOverride,
            );

            console.log(`Rooms created: ${batchResult}`);

            totalRoomsCreated += batchResult.roomsCreated;
            totalDatesProcessed += batchResult.datesProcessed;

            currentDate.setTime(batchEndDate.getTime());
        }

        console.table({
            totalDatesProcessed,
            totalRoomsCreated,
            roomCategory,
            startDate,
            endDate,
        });

        return {
            totalRoomsCreated,
            totalDatesProcessed,
        };
    }

    async processDateBatch(
        roomCategory: RoomCategory,
        startDate: Date,
        endDate: Date,
        priceOverride?: number,
    ) {
        let roomsCreated = 0;
        let datesProcessed = 0;
        const roomsToCreate: CreationAttributes<Room>[] = [];

        const currentDate = new Date(startDate);

        // SELECT * FROM ROOM_CATEGORY WHERE ID = ? AND DATE_OF_AVAILABILITY BETWEEN ? and ?
        // TODO: Use a better query to get the rooms
        while (currentDate <= endDate) {
            const existingRoom =
                await this.roomRepository.findByRoomCategoryIdAndDate(
                    roomCategory.id,
                    currentDate,
                );

            logger.info(
                `Existing room: ${JSON.stringify(existingRoom)} : ${currentDate}`,
            );

            if (!existingRoom) {
                const roomPayload = {
                    hotelId: roomCategory.hotelId,
                    roomCategoryId: roomCategory.id,
                    dateOfAvailability: new Date(currentDate),
                    price: priceOverride || roomCategory.price,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                };
                console.log(`Room payload: ${JSON.stringify(roomPayload)}`);
                roomsToCreate.push(roomPayload);
            }

            currentDate.setDate(currentDate.getDate() + 1);
            datesProcessed++;
        }

        console.log(`Rooms to create: ${JSON.stringify(roomsToCreate)}`);

        if (roomsToCreate.length > 0) {
            logger.info(`Creating ${roomsToCreate.length} rooms`);
            await this.roomRepository.bulkCreate(roomsToCreate);
            roomsCreated += roomsToCreate.length;
        }

        return {
            roomsCreated,
            datesProcessed,
        };
    }
}

const roomService = new RoomService();

export { roomService };
