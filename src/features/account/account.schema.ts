import { z } from 'zod';

const profileUpdateSchema = z.object({
    firstname: z.string('Not a string').trim()
        .min(2, 'First name should be atleast 2 characters long')
        .max(64, 'First name should not be longer than 64 characters')
        .optional(),
    lastname: z.string('Not a string').trim()
        .min(1, "Last name should be atleast 1 character long")
        .max(64, 'Last name cannot be greater than 64 characters')
        .optional()
}).refine((obj) => Object.keys(obj).length > 0, 'Please provide atleast one field to update');

const passwordUpdateSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password cannot be left empty')
        .max(128, 'Password length cannot exceed 128 characters'),
    newPassword: z.string('Not a string')
        .min(8, "New Password should be atleast 8 characters long")
        .max(128, "New Password shoud not be longer than 128 characters")
        .regex(/[a-z]/, 'New Password must contain atleast 1 lowercase alphabet')
        .regex(/[A-Z]/, 'New Password must contain atleast 1 uppercase alphabet')
        .regex(/[0-9]/, 'New Password must contain atleast 1 number')
        .regex(/[^a-zA-Z0-9]/, 'New Password must contain atleast 1 special character')
});

const usernameUpdateSchema = z.object({
    newUsername: z.string('Not a string').trim()
        .min(3, 'Username should be atleast 3 characters long')
        .max(64, 'Username cannot be larger than 64 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain Aphabets and Numbers'),
    password: z.string()
        .min(1, 'Current password cannot be left empty')
        .max(128, 'Password length cannot exceed 128 characters')
});

export {
    profileUpdateSchema,
    passwordUpdateSchema,
    usernameUpdateSchema
}