import type { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@errors/app.error.js';
import UserRepository  from '@repositories/user.repository.js';
import RefreshTokenRepository from '@repositories/refreshToken.repository.js'
import { createRefreshToken, verifyRefreshToken } from '@/utils/refreshToken.utils.js';
import * as AuthConstants from '@constants/auth.constants.js';

class AuthMiddleware {
    public refreshTokenRepository: RefreshTokenRepository;
    public userRepository: UserRepository;

    constructor (userRepository: UserRepository, refreshTokenRepository: RefreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    validateAccessToken(accessToken: string) {
        const verified = jwt.verify(accessToken, process.env.JWT_SECRET_KEY as string);
        if (!verified) {
            return null;
        }
        return verified;
    }

    async validateRefreshToken(refreshTokenId: string, refreshTokenValue: string) {
        const tokenDoc = await this.refreshTokenRepository.findOne(refreshTokenId);
        
        if (!tokenDoc){
            return null;
        }
        if (tokenDoc.status !== 'alive') return null;
        const isValid = await verifyRefreshToken(refreshTokenValue, tokenDoc.token);
        if (isValid) return tokenDoc.user.toString();
        await this.refreshTokenRepository.invalidateAllUser(tokenDoc.user.toString());
        return null;
    }

    async generateRefreshToken(userId: string) {
        const { refreshTokenValue, refreshTokenHash } = await createRefreshToken();
        const tokenDoc = await this.refreshTokenRepository.insertOne({user: userId, token: refreshTokenHash}).save();
        return {
            tokenId: tokenDoc._id.toString(),
            token: refreshTokenValue
        }
    }

    async generateAccessToken(userId: string, req: Request) {
        const user = await this.userRepository.findById(userId).select('_id username');
        if (!user) throw new UnauthorizedError('Please login again to proceed');
        const payload = {
            userId: user._id,
            username: user.username
        }
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: AuthConstants.ACCESS_TOKEN_LIFESPAN });
        req.user = payload;

        return accessToken;
    }
    
    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Check access token
            let accessToken =  req.cookies.auth;
            if (accessToken) {
                const verified = this.validateAccessToken(accessToken);
                if (verified) {
                    req.user = verified;
                    next();
                    return;
                }
            }

            // If access token fails, check refresh token
            const refreshTokenStr = req.cookies.refresh;
            if (!refreshTokenStr) {
                throw new UnauthorizedError('Please login to proceed');
            }

            // If refresh token found, validate
            let refreshToken = JSON.parse(refreshTokenStr);
            const userId = await this.validateRefreshToken(refreshToken.tokenId, refreshToken.token);
            if (!userId) {
                throw new UnauthorizedError('Please login to proceed');
            }
            const staleRefreshTokenId = refreshToken.tokenId;

            // If validated, generate new refresh token, new access token and invalidate previous refresh token
            [refreshToken, accessToken] = await Promise.all([
                this.generateRefreshToken(userId),
                this.generateAccessToken(userId, req),
                this.refreshTokenRepository.invalidateOne(staleRefreshTokenId)
            ]);

            // Update cookies
            res.cookie('auth', accessToken, { ...(AuthConstants.AUTH_COOKIES_PROPERTIES),
                maxAge: AuthConstants.ACCESS_TOKEN_COOKIE_LIFESPAN
            });
            res.cookie('refresh', JSON.stringify(refreshToken), { ...AuthConstants.AUTH_COOKIES_PROPERTIES,
                maxAge: AuthConstants.REFRESH_TOKEN_COOKIE_LIFESPAN
            });
            req.cookies.refresh = JSON.stringify(refreshToken);
            req.cookies.auth = accessToken;
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
}
export default AuthMiddleware;