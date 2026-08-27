// Lifespan of Refresh Token in seconds  -- days * hours * mins * seconds
export const REFRESH_TOKEN_LIFESPAN = 7 * 24 * 60 * 60;

// Lifespan of Access Token in jwt expiresIn format
export const ACCESS_TOKEN_LIFESPAN = '15min';

// Lifespan of Refresh Token cookie in ms  -- days * hours * mins * secs * ms
export const REFRESH_TOKEN_COOKIE_LIFESPAN = REFRESH_TOKEN_LIFESPAN * 1000;

// Lifespan of Access Tokens cookie in ms  -- mins * secs * ms
export const ACCESS_TOKEN_COOKIE_LIFESPAN = 15 * 60 * 1000;

export enum USER_ROLE {
    REGISTERED = 'registered',
    GUEST = 'guest'
}

export const AUTH_COOKIES_PROPERTIES: {
    httpOnly: boolean,
    secure: boolean,
    sameSite: boolean | "lax" | "strict" | "none" | undefined
} = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
}