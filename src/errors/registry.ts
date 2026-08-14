import { genericHandler, validationErrorHandler, invalidCredentialsErrorHandler } from './handlers/appErrors.handlers.js';
import { ERROR_MAP as E } from './app.error.js';

const registry: Map<string, Function> = new Map();

registry.set(E.APP_ERROR, genericHandler);
registry.set(E.BAD_REQUEST_ERROR, genericHandler);
registry.set(E.FORBIDDEN_ERROR, genericHandler);
registry.set(E.NOT_FOUND_ERROR, genericHandler);
registry.set(E.UNAUTHORIZED_ERROR, genericHandler);
registry.set(E.INVALID_CREDENTIALS_ERROR, invalidCredentialsErrorHandler)
registry.set(E.CONFLICT_ERROR, validationErrorHandler);
registry.set(E.VALIDATION_ERROR, validationErrorHandler);

export default registry;