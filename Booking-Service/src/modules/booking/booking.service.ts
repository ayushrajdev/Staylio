import { console } from 'inspector/promises';
import generateIdempotencyKey from '../../utils/helpers/generateIdempotencyKey.ts';
import IdempotencyRepository from '../idempotency/idempotency.repository.ts';
import BookingRepository from './booking.repository.ts';
import prisma from '../../config/prisma.config.ts';
import { lockService, redlock,  } from '../../config/redis/index.ts';
import { log } from 'winston';
import logger from '../../config/logger.config.ts';

export default class BookingService {
    // Service implementation
    bookingRepository: BookingRepository;
    constructor() {
        this.bookingRepository = new BookingRepository();
    }
    createBooking = async (userId: number, hotelId: number) => {
        //we will lock on the booking so that two parallel requests for the same booking cannot be processed at the same time
        console.log(`Creating booking for user ${userId} and hotel ${hotelId}`);
        const ttl = 1000*20; // 5 minutes
        const bookingResource = `hotel:${hotelId}:user:${userId}`;

        // redis distributed locking mechanism to ensure that only one request can create a booking for the same user and hotel at a time
        var lock = await redlock.acquire([bookingResource], ttl);
        try {
            const booking = await this.bookingRepository.create({
                hotelId,
                userId,
            });
            const idempotencyKey = generateIdempotencyKey();
            await IdempotencyRepository.createIdempotencyKey(
                idempotencyKey,
                booking.id,
            );

            console.log(
                `Booking created with id ${booking.id} and idempotency key ${idempotencyKey}`,
            );

            return { booking, idempotencyKey };
        } catch (error) {
            throw { error: 'Failed to create booking', details: error };
        } finally {
            // await lock.unlock()
        }
    };

    async confirmBooking(idempotencyKey: string) {
        // pessimistic locking to ensure that only one request can confirm the booking at a time
        return await prisma.$transaction(async (tx) => {
            const idempotency =
                await IdempotencyRepository.getIdempotencyKeyWithLock(
                    idempotencyKey,
                    tx,
                );

            if (!idempotency || !idempotency.bookingId) {
                throw new Error('Invalid idempotency key');
            }

            if (idempotency.finalized) {
                throw new Error('Booking already finalized');
            }
            const comfirmedBooking =
                await this.bookingRepository.confirmBooking(
                    tx,
                    idempotency.bookingId as number,
                );

            await IdempotencyRepository.finalizeIdempotencyKey(
                tx,
                idempotencyKey,
            );

            return comfirmedBooking;
        });
    }
}


//dead letter queue