import { console } from 'inspector/promises';
import generateIdempotencyKey from '../../utils/helpers/generateIdempotencyKey.ts';
import IdempotencyRepository from '../idempotency/idempotency.repository.ts';
import BookingRepository from './booking.repository.ts';

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
        console.log('Booking created:', booking);
        console.log('Idempotency key generated:', idempotencyKey);
        return { booking, idempotencyKey };
    }

    async confirmBooking(idempotencyKey: string) {
        const booking =
            await IdempotencyRepository.getIdempotencyKey(idempotencyKey);

        if (!booking) {
            throw new Error('Invalid idempotency key');
        }
        if (booking.finalized) {
            throw new Error('Booking already finalized');
        }
        const comfirmedBooking = await this.bookingRepository.confirmBooking(
            booking.bookingId as number,
        );

        await IdempotencyRepository.finalizeIdempotencyKey(idempotencyKey); 
        return comfirmedBooking;
    }
}
