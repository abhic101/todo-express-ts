class AppError extends Error {
    public code = 500;
    public name: string;

    constructor (message: string, options: Object = {}) {
        super(message, options);
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    public code = 400;
}

class UnauthorizedError extends AppError {
    public code = 401;
}

class InvalidCredentialsError extends UnauthorizedError {
    public field: string;
    constructor(message: string, field: string, options: Object = {}) {
        super(message, options);
        this.field = field;
    }
}

class ForbiddenError extends AppError {
    public code = 403;
}

class NotFoundError extends AppError {
    public code = 404;
}

class ConflictError extends AppError {
    public code = 409;
    public details: Array<Object>;
    constructor (message: string, details: Array<Object>, options: Object = {}) {
        super(message, options);
        this.details = details;
    }
}

class ValidationError extends ConflictError {
    public code = 422;
}

const ERROR_MAP = {
    APP_ERROR : AppError.name,
    BAD_REQUEST_ERROR: BadRequestError.name,
    UNAUTHORIZED_ERROR: UnauthorizedError.name,
    INVALID_CREDENTIALS_ERROR: InvalidCredentialsError.name,
    FORBIDDEN_ERROR: ForbiddenError.name,
    NOT_FOUND_ERROR: NotFoundError.name,
    CONFLICT_ERROR: ConflictError.name,
    VALIDATION_ERROR: ValidationError.name,
}

export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    InvalidCredentialsError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    ERROR_MAP
}