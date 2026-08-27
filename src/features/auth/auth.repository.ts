import type { Model, Types } from 'mongoose';
import type { IUser, IUserDocument} from '@models/user.model.js';
import type UserRepository from '@repositories/user.repository.js';
import type { IRefreshTokenDocument } from '@models/refreshToken.model.js';
import type RefreshTokenRepository from '@repositories/refreshToken.repository.js';
import { type ResponseTypes, type RepositoryTypes, Projections } from './auth.types.js';
import * as RefreshTokenTypes from '../../types/refreshTokens.types.js';
import { ConflictError, NotFoundError } from '@errors/app.error.js'

class AuthRepository {
    public UserModel: Model<IUserDocument>;
    public userRepository: UserRepository;
    public RefreshToken: Model<IRefreshTokenDocument>;
    public refreshTokenRepository: RefreshTokenRepository;

    constructor (UserModel: Model<IUserDocument>, userRepository: UserRepository, RefreshToken: Model<IRefreshTokenDocument>, refreshTokenRepository: RefreshTokenRepository) {
        this.UserModel = UserModel;
        this.userRepository = userRepository;
        this.RefreshToken = RefreshToken;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async createUser(signupData: RepositoryTypes.SignupInput) {
        try {
            await this.UserModel.create(signupData);
        } catch(err: any) {
            if (err.code == 11000) {    // Map MongoError to ConflictError
                const details: any = Object.keys(err.keyPattern).map((field) =>
                    ({field: field, message: `${err.keyValue[field]} already exists`})
                )
                throw new ConflictError(`Duplicate value for ${details[0].field} field`, details);
            } else {
                throw err;
            }
        }
    }

    async findUserByUsername(username: string) {
        const user = await this.userRepository.findByUsername(username)
            .select(Projections.user)
            .lean<RepositoryTypes.UserLeanType>();
        return user;
    }

    async findProfileById(userId: string): Promise<ResponseTypes.UserProfile | null> {
        const user = await this.userRepository.findById(userId)
            .select(Projections.profile)
            .lean<RepositoryTypes.ProfileLeanType>();
        if (!user) return null;
        const {_id, ...userProfile} = {...user, userId: user._id.toString()}
        return userProfile;
    }

    async checkUserExistsByUsername(username: string) {
        const user = await this.UserModel.exists({username: username, isActive: true});
        return user;
    }

    async insertRefreshToken(tokenData: RefreshTokenTypes.TokenInput) {
        const newToken = await this.refreshTokenRepository.insertOne(tokenData).save();
        return newToken._id;
    }

    async findRefreshTokenById(tokenId: string) {
        const token = await this.refreshTokenRepository.findOne(tokenId).lean<RefreshTokenTypes.LeanType>();
        if (!token) {
            throw new NotFoundError('Refresh Token Not Found');
        }
        return token;
    }

    async invalidateRefreshToken(tokenId: string) {
        try {
            await this.refreshTokenRepository.invalidateOne(tokenId);
        } catch (err: any) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Refresh Token Not Found');
            } else {
                throw err;
            }
        }
    }
}

export default AuthRepository;