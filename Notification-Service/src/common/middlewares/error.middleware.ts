import type { NextFunction, Request, Response } from 'express';
import type { AppError } from '../utils/errors/app.error.ts';

export function genericErrorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}
