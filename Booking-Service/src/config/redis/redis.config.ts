export const redisConfig = {
    host: process.env.REDIS_HOST! || 'localhost',
    port: Number(process.env.REDIS_PORT)||6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB)||0,

    connectTimeout: 10000,

    maxRetriesPerRequest: null,

    retryStrategy(times: number) {
        const delay = Math.min(times * 100, 3000);

        console.log(`Redis reconnecting (${times})`);

        return delay;
    }
};