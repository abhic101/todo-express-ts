// import { DataTypes, Model, type Optional } from 'sequelize';
// import { sequelize } from '@config/dbConfig.js';

enum USER_ROLE {
    REGISTERED = 'registered',
    GUEST = 'guest'
}

// interface UserAttributes {
//     id: string;
//     username: string;
//     passwordHash: string;
//     type: typeof USER_TYPE[number];
//     firstname: string;
//     lastname: string;
//     is_active: boolean;
// }

// interface UserCreationAttribute extends Optional<UserAttributes, 'id' | 'lastname' | 'is_active'> {}

// class User extends Model<UserAttributes, UserCreationAttribute> implements UserAttributes {
//     public id!: string;
//     public username!: string;
//     public passwordHash!: string;
//     public type!: typeof USER_TYPE[number];
//     public firstname!: string;
//     public lastname!: string;
//     public is_active!: boolean;
// }
import { Schema, model, Document} from 'mongoose';

// Shape of data. For typescript compile time validation
interface IUser {
    username: string;
    passwordHash: string;
    role: USER_ROLE;
    firstname: string;
    lastname: string;
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