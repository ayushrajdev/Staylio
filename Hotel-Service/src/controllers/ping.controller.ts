import type { Request, Response } from 'express';
import logger from '../config/logger.config.ts';
import { InternalServerError } from '../utils/errors/app.error.ts';

export function pingHandler(req: Request, res: Response): void {
    try {
        res.end('pong');
        logger.info('ping handler responded');
    } catch (error) {
        throw new InternalServerError('internal server error');
    }
}
