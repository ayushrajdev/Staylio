import type { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.config.ts';
import { asyncLocalStorage } from '../utils/helpers/request.helper.ts';

export function attachCorrelationId(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const correlationId = crypto.randomUUID();
    asyncLocalStorage.run({ correlationId }, () => {
        logger.info('correlation id is generated');
        next();
    });
}
