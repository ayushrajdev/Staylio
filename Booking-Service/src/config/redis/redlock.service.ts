import redlock from "./redlock.client.ts";

class LockService {

    async acquire(resource: string, ttl: number) {

        return redlock.acquire(
            [resource],
            ttl
        );
    }

    async release(lock: Awaited<ReturnType<typeof redlock.acquire>>) {

        await lock.unlock();
    }

}

export default new LockService();