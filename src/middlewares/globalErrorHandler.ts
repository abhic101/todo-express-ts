import registry from '@errors/registry.js';
import type {Request, Response, NextFunction} from 'express';

function globalErrorHandler(err: any, req: Request, res: Response, next:NextFunction) {

    // Logging
    console.error("An error occurred: ", err);

    // Handling through registry
    if (registry.has(err.name)) {
        const handler = registry.get(err.name);
        handler ? handler(err, res): {};
    }
    else {
        res.status(500).json({
            message: 'Internal Server Error. Please try again after some time'
        })
    }
}

export default globalErrorHandler;