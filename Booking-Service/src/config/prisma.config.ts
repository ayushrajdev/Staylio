import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const prisma = new PrismaClient({
    adapter: new PrismaMariaDb({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '995528',
        database: 'staylio_booking_service',
    }),
});

export default prisma;
