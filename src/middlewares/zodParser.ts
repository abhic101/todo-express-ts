import { type ZodObject, ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@errors/app.error.js';

const zodParser = (schema: ZodObject, shape: 'body' | 'params' | 'query' = 'body') => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = schema.parse(req[shape]);
        req[shape] = validated;
        next();
    } catch(err) {
        if (err instanceof ZodError) {
            const details = err.issues.map((voilation) => {
                return {
                    field: voilation.path[0],
                    message: voilation.message
                }
            });
            throw new ValidationError(`Please provide valid fields`, details, {cause: err});
        } else {
            next(err);
        }
    }
}

export default zodParser;