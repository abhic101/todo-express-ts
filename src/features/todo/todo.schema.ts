import { z } from 'zod';

const taskIdSchema = z.object({
    taskId: z.string().trim()
        .min(1, 'Invalid id string')
        .max(128, 'Invalid id string')
});

const addTaskSchema = z.object({
    task_name: z.string().trim()
        .min(1, 'Please give task name')
        .max(128, 'Task Name cannot exceed 128 characters'),
    task_details: z.string().trim()
        .max(65536)
        .optional()
});

const updateTaskSchema = addTaskSchema.partial().extend({
    status: z.boolean().optional()
}).refine(
    (schema) => Object.keys(schema).length > 0,
    'Please provide atleast one field to update'
);

export {
    taskIdSchema,
    addTaskSchema,
    updateTaskSchema
}