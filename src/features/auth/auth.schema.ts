import { z } from 'zod';

// login schema
const loginSchema = z.object({
    username: z.string('Not a string').trim()
        .min(3, 'Username should be atleast 3 characters long')
        .max(64, 'Username cannot be larger than 64 characters')
        .toLowerCase(),
    password: z.string('Not a string')
        .min(1, 'Password cannot be left empty')
        .max(128, 'Password length cannot exceed 128 characters')
});

const signupSchema = z.object({
    username: z.string('Not a string').trim()
        .min(3, 'Username should be atleast 3 characters long')
        .max(64, 'Username cannot be larger than 64 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain Aphabets and Numbers'),
    password: z.string('Not a string')
        .min(8, "Password should be atleast 8 characters long")
        .max(128, "Password shoud not be longer than 128 characters")
        .regex(/[a-z]/, 'Password must contain atleast 1 lowercase alphabet')
        .regex(/[A-Z]/, 'Password must contain atleast 1 uppercase alphabet')
        .regex(/[0-9]/, 'Password must contain atleast 1 number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain atleast 1 special character'),
    firstname: z.string('Not a string').trim()
        .min(2, 'First name should be atleast 2 characters long')
        .max(64, 'First name should not be longer than 64 characters'),
    lastname: z.string('Not a string').trim()
        .max(64, 'Last name cannot be greater than 64 characters')
        .optional()
});

const usernameSchema = signupSchema.pick({username: true});

export {
    loginSchema,
    signupSchema,
    usernameSchema
}