import { Schema, model, Document} from 'mongoose';
import { USER_ROLE } from '@constants/auth.constants.js';

// Shape of data. For typescript compile time validation
interface IUser {
    username: string;
    passwordHash: string;
    role: USER_ROLE;
    firstname: string;
    lastname?: string | undefined;
    isActive: boolean;
}

// Creating document interface, inherit Mongoose document methods
interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
    username: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default: USER_ROLE.REGISTERED
    },
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

UserSchema.index({username: 1}, {unique: true, partialFilterExpression: {isActive: true}});
UserSchema.index({username: 1, isActive: -1});

const User =  model<IUserDocument>('User', UserSchema);

export default User;
export type {
    IUser, IUserDocument
}