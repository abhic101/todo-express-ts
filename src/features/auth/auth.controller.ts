import type  AuthService from './auth.service.js';
import type { Request, Response, NextFunction } from 'express';

class AuthController {
    public service: AuthService;

    constructor (service: AuthService) {
        this.service = service;
    }

    signupHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try {
            await this.service.signup(req.body);
            res.status(201).json({
                message: 'Account created successfully'
            });
        } catch (err) {
            next(err);
        }
    }

    loginHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try {
            const { user, jwtToken } = await this.service.login(req.body);
            res.cookie('auth', jwtToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                message: 'Login Successfull',
                user: user
            });
        } catch (err) {
            next(err);
        }
    }

    getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.service.getMe(req.user.userId);
            res.status(200).json({
                message: 'User profile fetched successfully',
                user: user
            })
        } catch(err) {
            next(err);
        }
    }

    logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('auth');
            res.status(200).json({
                message: 'Logout Successfull'
            });
        } catch(err) {
            next(err);
        }
    }

    checkUsernameHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.checkUsernameConflict(req.body.username);
            res.status(200).json({
                message: 'username available'
            })
        } catch(err) {
            next(err);
        }
    }
}

export default AuthController;