import Redlock from 'redlock';
import redisClient from './redis.client.ts';
const client = redisClient.getClient();

const redlock = new Redlock([client], {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200,
    retryJitter: 200,
});
redlock.on('clientError', function (err) {
    console.error('A redis error has occurred:', err);
});

export default redlock;
