import { Document, model, Schema, Types } from 'mongoose';
import { REFRESH_TOKEN_LIFESPAN } from '@/constants/auth.constants.js';

enum STATUS {
    ALIVE = 'alive',
    DEAD = 'dead'
};

interface IRefreshToken {
    token: string;
    user: Types.ObjectId;
    status: STATUS | undefined;
}

interface IRefreshTokenDocument extends IRefreshToken, Document {}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(STATUS),
        default: STATUS.ALIVE
    }
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

RefreshTokenSchema.index({'created_at': 1}, { expireAfterSeconds: REFRESH_TOKEN_LIFESPAN});

const RefreshToken = model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
export {
    type IRefreshToken,
    type IRefreshTokenDocument,
    REFRESH_TOKEN_LIFESPAN
}