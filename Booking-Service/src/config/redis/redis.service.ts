import redisClient from './redis.client.ts';

class RedisService {
    private redis = redisClient.getClient();

    async set(key: string, value: unknown, ttl?: number) {
        const data = JSON.stringify(value);

        if (ttl) {
            await this.redis.set(key, data, 'EX', ttl);
            return;
        }

        await this.redis.set(key, data);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);

        if (!data) return null;

        return JSON.parse(data);
    }

    async del(key: string) {
        return this.redis.del(key);
    }

    async exists(key: string) {
        return this.redis.exists(key);
    }

    async expire(key: string, seconds: number) {
        return this.redis.expire(key, seconds);
    }

    async increment(key: string) {
        return this.redis.incr(key);
    }

    async decrement(key: string) {
        return this.redis.decr(key);
    }

    async flush() {
        return this.redis.flushdb();
    }
}


export default new RedisService();
