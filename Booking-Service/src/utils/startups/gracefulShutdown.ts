import { Server } from "http";
import logger from "../../config/logger.config.ts";
import prisma from "../../config/prisma.config.ts";
import { redisClient } from "../../config/redis/index.ts";


export function registerGracefulShutdown(server: Server) {
    async function shutdown(signal: string) {
        logger.warn(`${signal} received. Starting graceful shutdown...`);

        server.close(async (err) => {
            if (err) {
                logger.error(err);
                process.exit(1);
            }

            try {
                logger.info("Disconnecting Prisma...");
                await prisma.$disconnect();

                logger.info("Database disconnected.");

                logger.info("Graceful shutdown completed.");

                process.exit(0);
            } catch (error) {
                logger.error(error);
                process.exit(1);
            }
        });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}



async function shutdown(signal: string) {

    console.log(`${signal} received`);

    await redisClient.disconnect();

    process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));