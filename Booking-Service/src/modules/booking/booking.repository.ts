import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma.config.ts';

export default class BookingRepository {
    create(data: Prisma.BookingCreateInput) {
        prisma.booking.create({ data });
    }
}
