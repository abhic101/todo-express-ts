import type { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@errors/app.error.js';

function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const token =  req.cookies.auth;
        if (!token) {
            throw new UnauthorizedError('Please login to procced');
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        if (!verified) {
            throw new UnauthorizedError('Please login again to procced');
        }
        req.user = verified;
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            next(new UnauthorizedError('Please login again to proceed'));
        }
        else {
            next(err);
        }
    }
}

export default auth;