import prisma from '../../config/prisma.config.ts';
import { type IdempotencyKey } from '@prisma/client';

export default class IdempotencyRepository {
    static async createIdempotencyKey(
        idempotencyKey: string,
        bookingId: number,
    ): Promise<number> {
        const idempotency = await prisma.idempotencyKey.create({
            data: {
                key: idempotencyKey,
                booking: {
                    connect: {
                        id: bookingId,
                    },
                },
            },
        });
        return idempotency.id;
    }

    static async getIdempotencyKey(
        idempotencyKey: string,
    ): Promise<IdempotencyKey | null> {
        const idempotency = await prisma.idempotencyKey.findUnique({
            where: {
                key: idempotencyKey,
            },
        });
        return idempotency;
    }

    static async finalizeIdempotencyKey(
        idempotencyKey: string,
    ): Promise<IdempotencyKey | null> {
        const idempotency = await prisma.idempotencyKey.update({
            where: {
                key: idempotencyKey,
            },
            data: {
                finalized: true,
            },
        });
        return idempotency;
    }
}
