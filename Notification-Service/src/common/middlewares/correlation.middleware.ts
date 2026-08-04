import type { NextFunction, Request, Response } from 'express';
import { asyncLocalStorage } from '../../utils/helpers/request.helper.ts';
import logger from '../../config/logger.config.ts';


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
