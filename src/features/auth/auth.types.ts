import { z } from 'zod';
import { loginSchema, signupSchema } from './auth.schema.js';
import type {IUserDocument} from '@models/user.model.js';


// Request types (shape)
export namespace RequestTypes {
    export type LoginInput = z.infer<typeof loginSchema>;
    export type SignupInput = z.infer<typeof signupSchema>;
}

// Interal layers types
export namespace Projections {
    export const profileArr = ['_id', 'username', 'role', 'firstname', 'lastname'] as const;
    export const profile = profileArr.join(' ');
    export const userArr = [...profileArr, 'passwordHash'] as const;
    export const user = userArr.join(' ');
}

export namespace RepositoryTypes {
    export type ProfileLeanType = Pick<IUserDocument, typeof Projections.profileArr[number]>;
    export type UserLeanType = Pick<IUserDocument, typeof Projections.userArr[number]>;
    export type SignupInput = Omit<RequestTypes.SignupInput, 'password'> & {passwordHash: string};
}

// Response shape
export namespace ResponseTypes {
    export type UserProfile = Omit<RepositoryTypes.ProfileLeanType, "_id"> & {userId: string};
}