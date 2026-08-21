//this file contain all the configuration to app server to work

import dotenv from 'dotenv';
//this will load the env variable form the os

type serverConfig = {
    PORT: number;
};

export function loadEnv() {
    dotenv.config({
        path: `.env.${process.env.NODE_ENV ?? 'development'}`,
    });
}
loadEnv();
export const serverConfig: serverConfig = {
    PORT: Number(process.env.PORT) || 3000,
};

export const Queues = {
    ROOM_QUEUE: 'RoomQueue',
};
