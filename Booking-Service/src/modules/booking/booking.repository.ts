import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma.config.ts';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export default class BookingRepository {
    async create(data: Prisma.BookingCreateInput) {
        return await prisma.booking.create({ data });
    }

    async #changeBookingStatus(bookingId: number, status: BookingStatus) {
        return await prisma.booking.update({
            where: { id: bookingId },
            data: { status },
        });
    }
    async confirmBooking(tx: Prisma.TransactionClient, bookingId: number) {
        return await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: "CONFIRMED",
                idempotency: {
                    update: {
                        finalized: true,
                    },
                },
            },
        });
    }

    async cancelBooking(tx: Prisma.TransactionClient, bookingId: number) {
        return await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: "CANCELLED",
                idempotency: {
                    update: {
                        finalized: false,
                    },
                },
            },
        });
    }

    async deleteBooking(tx: Prisma.TransactionClient, bookingId: number) {
          await tx.booking.delete({
            where: { id: bookingId },
        });  
    }

            

}
