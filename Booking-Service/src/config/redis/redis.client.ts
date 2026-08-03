import { Redis } from 'ioredis';
import { redisConfig } from './redis.config.ts';


class RedisClient {
    private client: Redis;

    constructor() {
        this.client = new Redis(redisConfig);
        this.registerEvents();
    }

    private registerEvents() {
        this.client.on('connect', () => {
            console.log('Redis Connected');
        });

        this.client.on('ready', () => {
            console.log('Redis Ready');
        });

        this.client.on('error', (err) => {
            console.error('Redis Error:', err);
        });

        this.client.on('close', () => {
            console.log('Redis Connection Closed');
        });

        this.client.on('reconnecting', () => {
            console.log('Redis Reconnecting...');
        });

        this.client.on('end', () => {
            console.log('Redis Connection Ended');
        });
    }

    getClient() {
        return this.client;
    }

    async disconnect() {
        await this.client.quit();
    }
}



export default new RedisClient();
