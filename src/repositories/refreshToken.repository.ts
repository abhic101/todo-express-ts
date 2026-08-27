import type { Model } from 'mongoose';
import type { IRefreshToken, IRefreshTokenDocument } from '@/models/refreshToken.model.js';
import { type TokenInput } from '../types/refreshTokens.types.js';

class RefreshTokenRepository {
    public RefreshToken: Model<IRefreshTokenDocument>;

    constructor(model: Model<IRefreshTokenDocument>) {
        this.RefreshToken = model;
    }

    /**
     * @param tokenData Should contain token and user objectId
     * @returns New Refresh Token document, intented to be saved where its called.
     */
    insertOne(tokenData: TokenInput) {
        const newToken = new this.RefreshToken({
            token: tokenData.token,
            user: tokenData.user
        });
        return newToken;
    }

    /**
     * @param tokenId Ojbect Id of the RefreshToken document
     * @returns Query to be executed
     */
    findOne(tokenId: string) {
        const tokenQuery = this.RefreshToken.findById(tokenId);
        return tokenQuery;
    }

    /**
     * Invalidates the token before its expiry
     * @param tokenId Ojbect Id of the RefreshToken document
     * @returns Query to be executed
     */
    invalidateOne(tokenId: string) {
        const tokenQuery = this.RefreshToken.findByIdAndUpdate(tokenId, {
            $set: {
                status: 'dead'
            }
        })

        return tokenQuery;
    }

    /**
     * Invalidates all the tokens of a user before its expiry
     * @param userId Object Id of the user
     * @returns Query to be executed
     */
    invalidateAllUser(userId: string) {
        const tokenQuery = this.RefreshToken.updateMany({user: userId}, {
            $set: {status: 'dead'}
        });
        return tokenQuery;
    }
}

export default RefreshTokenRepository;