import cron from 'node-cron';

import logger from '../config/logger.config.ts';

import {
    RoomGenerationSchedulerService,
} from '../services/roomGenerationScheduler.service.ts';

const scheduler =
    new RoomGenerationSchedulerService();

/*
 * Run every day at 12:00 AM.
 *
 * The scheduler does not create rooms.
 * It only decides what date should be generated
 * and places a job into BullMQ.
 */
cron.schedule(
    '0 0 * * * *',
    async () => {
        logger.info(
            'Cron triggered: room generation',
        );

        try {
            await scheduler.run();
        } catch (error) {
            logger.error(
                'Room generation scheduler failed',
                error,
            );
        }
    },
    {
        timezone: 'Asia/Kolkata',
    },
);

logger.info(
    'Room generation cron initialized',
);