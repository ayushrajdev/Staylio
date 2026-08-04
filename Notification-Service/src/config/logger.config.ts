import winston from 'winston';
import { getCorrelationId } from '../utils/helpers/request.helper.ts';
import DailyRotateFile from 'winston-daily-rotate-file';
//create the logger object
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY  HH-MM-SS' }),
        winston.format.json(),
        winston.format.printf(({ message, timestamp, level, ...data }) => {
            const output = {
                message,
                level,
                timestamp,
                data,
                correlationId: getCorrelationId(),
            };
            return JSON.stringify(output);
        }),
    ),
    // where you want that log should go or be written
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({
        //     filename: 'logs/app.log',
        // }),
        new DailyRotateFile({
            filename: 'logs/%DATE%-app.log',
            datePattern:"DD-MM-YYYY",
            maxFiles:"14d"
        }),
    ],
});

export default logger;
