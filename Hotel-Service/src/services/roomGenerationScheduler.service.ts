import logger from '../config/logger.config.ts';

import { RoomCategoryRepository } from '../repositories/roomCategory.repository.ts';

import { RoomRepository } from '../repositories/room.repository.ts';


import type RoomCategory from '../db/models/roomCategory.ts';
import RoomQueue from '../message-queues/queues/RoomQueue.ts';

export class RoomGenerationSchedulerService {
    private roomCategoryRepository: RoomCategoryRepository;
    private roomRepository: RoomRepository;

    constructor() {
        this.roomCategoryRepository =
            new RoomCategoryRepository();

        this.roomRepository =
            new RoomRepository();
    }

    async run() {
        logger.info(
            'Room generation scheduler started',
        );

        const roomCategories =
            await this.roomCategoryRepository.findAll();

        logger.info(
            `Found ${roomCategories.length} room categories`,
        );

        for (const roomCategory of roomCategories) {
            try {
                await this.processRoomCategory(
                    roomCategory,
                );
            } catch (error) {
                logger.error(
                    `Failed to schedule room generation for room category ${roomCategory.id}`,
                    error,
                );
            }
        }

        logger.info(
            'Room generation scheduler finished',
        );
    }

    private async processRoomCategory(
        roomCategory: RoomCategory,
    ) {
        logger.info(
            `Processing room category ${roomCategory.id}`,
        );

        /*
         * Example:
         *
         * roomCount = 5
         *
         * 25 -> 5 rooms
         * 26 -> 5 rooms
         * 27 -> 5 rooms
         *
         * lastCompleteDate = 27
         */
        const lastCompleteDate =
            await this.roomRepository.findLastCompleteDate(
                roomCategory.id,
                roomCategory.roomCount,
            );

        let nextDate: string;

        /*
         * If this category has never had rooms generated,
         * start from today.
         *
         * Otherwise move one calendar day forward from
         * the latest complete date.
         */
        if (!lastCompleteDate) {
            nextDate = getTodayDateOnly();
        } else {
            nextDate = addDays(
                lastCompleteDate,
                1,
            );
        }

        /*
         * Check whether the next date already contains
         * inventory.
         *
         * This is important because the job could have
         * already been queued by another scheduler tick
         * or manually.
         */
        const existingRooms =
            await this.roomRepository.findAllByRoomCategoryIdAndDate(
                roomCategory.id,
                nextDate,
            );

        /*
         * If the required inventory already exists,
         * there is nothing to schedule.
         */
        if (
            existingRooms.length >=
            roomCategory.roomCount
        ) {
            logger.info(
                `Inventory already complete for category=${roomCategory.id}, date=${nextDate}. Skipping.`,
            );

            return;
        }

        /*
         * If we have partial inventory, for example:
         *
         * roomCount = 5
         * existing = 2
         *
         * the RoomService will create the remaining 3.
         *
         * Therefore we still enqueue the job.
         */
        logger.info(
            `Scheduling room generation. category=${roomCategory.id}, date=${nextDate}, existing=${existingRooms.length}, required=${roomCategory.roomCount}`,
        );

        const jobId =
            `room-generation-${roomCategory.id}-${nextDate}`;

        await RoomQueue.add(
            'room',
            {
                roomCategoryId: roomCategory.id,

                /*
                 * Both dates are the same because the scheduler
                 * wants to generate exactly ONE calendar date.
                 *
                 * Your RoomService uses an inclusive end date.
                 */
                startDate: nextDate,
                endDate: nextDate,

                batchSize: 1,
            },
            {
                jobId,

                /*
                 * Successful jobs do not need to remain in Redis.
                 */
                removeOnComplete: true,

                /*
                 * Keep failed jobs so they can be investigated.
                 */
                removeOnFail: false,
            },
        );

        logger.info(
            `Room generation job queued. jobId=${jobId}`,
        );
    }
}

/**
 * Add calendar days to a YYYY-MM-DD date.
 *
 * This does NOT change the API/database representation.
 * DATEONLY remains YYYY-MM-DD.
 */
function addDays(
    dateString: string,
    days: number,
): string {
    const parts = dateString.split('-');

    if (parts.length !== 3) {
        throw new Error(
            `Invalid date: ${dateString}`,
        );
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const date = new Date(
        Date.UTC(
            year,
            month - 1,
            day,
        ),
    );

    date.setUTCDate(
        date.getUTCDate() + days,
    );

    return date
        .toISOString()
        .slice(0, 10);
}

/**
 * Get today's calendar date as YYYY-MM-DD.
 */
function getTodayDateOnly(): string {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
        now.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
}