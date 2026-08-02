import prisma from '../../config/prisma.config.ts';
import { Prisma, type IdempotencyKey } from '@prisma/client';

export default class IdempotencyRepository {
    static async createIdempotencyKey(
        idempotencyKey: string,
        bookingId: number,
    ): Promise<number> {
        const idempotency = await prisma.idempotencyKey.create({
            data: {
                idemkey: idempotencyKey,
                booking: {
                    connect: {
                        id: bookingId,
                    },
                },
            },
        });
        return idempotency.id;
    }

    static async getIdempotencyKeyWithLock(
        idempotencyKey: string,
        tx: Prisma.TransactionClient,
    ): Promise<IdempotencyKey | undefined> {
        //    const idempotency:IdempotencyKey[] = await tx.$queryRaw`SELECT * FROM "IdempotencyKey" WHERE idemKey = ${idempotencyKey} FOR UPDATE`;
        const idempotency: Array<IdempotencyKey> = await tx.$queryRaw(
            Prisma.raw(
                `SELECT * FROM IdempotencyKey WHERE idemKey = '${idempotencyKey}' FOR UPDATE;`,
            ),
        );
        if (!idempotency || idempotency.length === 0) {
            return undefined;
        }
        return idempotency[0];
    }

    static async finalizeIdempotencyKey(
        tx: Prisma.TransactionClient,
        idempotencyKey: string,
    ): Promise<IdempotencyKey | null> {
        const idempotency = await tx.idempotencyKey.update({
            where: {
                idemkey: idempotencyKey,
            },
            data: {
                finalized: true,
            },
        });
        return idempotency;
    }
}
