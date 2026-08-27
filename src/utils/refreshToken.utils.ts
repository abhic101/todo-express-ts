import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function createRefreshToken() {
    const refreshTokenValue = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshTokenValue, salt);

    return {
        refreshTokenValue,
        refreshTokenHash
    }
}

export async function verifyRefreshToken(tokenValue: string, tokenHash: string) {
    const isVerified = await bcrypt.compare(tokenValue, tokenHash);

    return isVerified;
}