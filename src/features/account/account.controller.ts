import type { Request, Response, NextFunction } from 'express';
import type AccountService from './account.service.js'

class AccountController {
    public service: AccountService;

    constructor(accountService: AccountService) {
        this.service = accountService;
    }

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.service.getUser(req.user.userId);
            res.status(200).json({
                message: "User fetched successfully",
                user: user
            });
        } catch(err) {
            next(err);
        }
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedUser = await this.service.updateProfile(req.user.userId, req.body);
            res.status(201).json({
                message: 'User profile updated successfully',
                user: updatedUser
            });
        } catch(err) {
            next(err);
        }
    }

    changeUsername = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.service.changeUsername(req.user.userId, req.body);
            res.cookie('auth', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 1 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                message: 'Username changed'
            });
        } catch(err) {
            next(err);
        }
    }

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.service.changePassword(req.user.userId, req.body);
            res.clearCookie('auth');
            res.status(200).json({
                message: 'Password changed. Please login again'
            })
        } catch(err) {
            next(err);
        }
    }
}

export default AccountController;