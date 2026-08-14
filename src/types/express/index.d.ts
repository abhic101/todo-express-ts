import type { JwtPayload } from 'jwt'

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

export {};