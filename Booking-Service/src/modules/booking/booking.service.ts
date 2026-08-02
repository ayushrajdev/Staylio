import { console } from 'inspector/promises';
import generateIdempotencyKey from '../../utils/helpers/generateIdempotencyKey.ts';
import IdempotencyRepository from '../idempotency/idempotency.repository.ts';
import BookingRepository from './booking.repository.ts';
import prisma from '../../config/prisma.config.ts';

export default class BookingService {
    // Service implementation
    bookingRepository: BookingRepository;
    constructor() {
        this.bookingRepository = new BookingRepository();
    }
    async createBooking(userId: number, hotelId: number) {
        const booking = await this.bookingRepository.create({
            hotelId,
            userId,
        });
        const idempotencyKey = generateIdempotencyKey();
        await IdempotencyRepository.createIdempotencyKey(
            idempotencyKey,
            booking.id,
        );

        return { booking, idempotencyKey };
    }

    async confirmBooking(idempotencyKey: string) {
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
