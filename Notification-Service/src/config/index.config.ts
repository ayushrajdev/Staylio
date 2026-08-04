//this file contain all the configuration to app server to work

import dotenv from 'dotenv';
//this will load the env variable form the os

type serverConfig = {
    PORT: number;
    
};

export function loadEnv() {
    dotenv.config();
}
loadEnv();
export const serverConfig: serverConfig = {
    PORT: Number(process.env.PORT) || 3000,
};



export const Queues = {
  EMAIL_QUEUE: "EmailQueue",
  SMS_QUEUE: "SmsQueue",
  PUSH_NOTIFICATION_QUEUE: "PushNotificationQueue",
} as const;