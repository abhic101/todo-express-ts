import type { Response } from 'express'
import type { ValidationError, ConflictError, InvalidCredentialsError} from '@errors/app.error.js'

function genericHandler(err: any, res: Response)  {
    res.status(err.code).json({
        message: err.message
    })
}

function invalidCredentialsErrorHandler(err: InvalidCredentialsError, res: Response) {
    res.status(err.code).json({
        field: err.field,
        message: err.message
    })
}

function validationErrorHandler(err: ValidationError | ConflictError, res: Response) {
    res.status(err.code).json({
        message: err.message,
        details: err.details
    });
}

export {
    genericHandler,
    validationErrorHandler,
    invalidCredentialsErrorHandler
}