import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny,  } from 'zod';

// type ValidateOptions = {
//     body?: ZodTypeAny;
//     query?: ZodTypeAny;
//     params?: ZodTypeAny;
// };

// export function validate(options: ValidateOptions) {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             if (options.body) {
//                 await options.body.parseAsync(req.body);
//             }

//             if (options.query) {
//                 await options.query.parseAsync(req.query);
//             }

//             if (options.params) {
//                 await options.params.parseAsync(req.params);
//             }

//             next();
//         } catch (error: any) {
//             res.status(400).json({
//                 message: 'invalid input',
//                 errors: error.errors,
//             });
//         }
//     };
// }

class ValidatorBuilder {
    private bodySchema?: ZodTypeAny;
    private querySchema?: ZodTypeAny;
    private paramsSchema?: ZodTypeAny;

    body(schema: ZodTypeAny) {
        this.bodySchema = schema;
        return this;
    }

    query(schema: ZodTypeAny) {
        this.querySchema = schema;
        return this;
    }

    params(schema: ZodTypeAny) {
        this.paramsSchema = schema;
        return this;
    }

    run() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const [body, query, params] = await Promise.all([
                    this.bodySchema && this.bodySchema?.parseAsync(req.body),
                    this.querySchema && this.querySchema?.parseAsync(req.query),
                    this.paramsSchema &&
                        this.paramsSchema?.parseAsync(req.params),
                ]);

                // if (body) req.body = body;
                // if (query) req.query = query;
                // if (params) req.params = params;

                next();
            } catch (err) {
                if (err instanceof ZodError) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: err,
                    });
                }

                res.status(400).json({ message: 'Invalid input' });
            }
        };
    }
}

export function validate() {
    return new ValidatorBuilder();
}
