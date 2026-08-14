interface LoginServiceInput {
    username: string,
    password: string
}

interface SignupServiceInput {
    username: string;
    password: string;
    firstname: string;
    lastname?: string;
}

interface SignupRepositoryInput {
    username: string,
    passwordHash: string,
    firstname: string,
    lastname?: string
}

interface JwtPayload {
    userId: string,
    username: string
}

interface UserProfileO {
    userId: string;
    firstname: string;
    lastname?: string;
    username?: string;
}

export type {
    LoginServiceInput,
    SignupServiceInput,
    SignupRepositoryInput,
    JwtPayload,
    UserProfileO
}