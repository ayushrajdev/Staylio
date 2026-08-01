import express from 'express';
import { loadEnv } from './config/index.config.ts';
import v1Router from './index.router.ts';
import { genericErrorHandler } from './middlewares/error.middleware.ts';
import { attachCorrelationId } from './middlewares/correlation.middleware.ts';
import prisma from './config/prisma.config.ts';
import registerGlobalErrorHandlers from './utils/startups/registerGlobalErrorHandlers.ts';
import { logStartupInfo } from './utils/startups/startupLogger.ts';
import { registerGracefulShutdown } from './utils/startups/gracefulShutdown.ts';

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(attachCorrelationId);

app.use('/api/v1', v1Router);

app.use(genericErrorHandler);

async function bootstrap() {
    try {
        loadEnv();

        registerGlobalErrorHandlers();
        console.log('Connecting to database...');

        await prisma.$connect();

        console.log('Database connected successfully.');

        const server = app.listen(3000, async () => {
            logStartupInfo({
                nodeEnv: 'development',
                port: 3000,
            });

            registerGracefulShutdown(server);
            console.log(`Server running on port ${3000}`);
        });
    } catch (error) {
        console.error('Failed to connect to database.');
        console.error(error);
        process.exit(1);
    }
}

bootstrap();
