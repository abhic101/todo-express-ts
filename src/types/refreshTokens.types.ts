import type { IRefreshToken, IRefreshTokenDocument } from '@models/refreshToken.model.js';


export type TokenInput = Omit<IRefreshToken, 'status' | 'user'> & {user: string};

export namespace Projection {
    export const arr = ['_id', 'token', 'user'] as const;
    export const doc =  arr.join(' ');
}

export type LeanType = Pick<IRefreshTokenDocument, typeof Projection.arr[number]>
export type Response = Omit<IRefreshToken, 'status' | 'user'> & {user: string};