import express from 'express';
import { zodParser } from '@middlewares';
import { taskIdSchema, addTaskSchema, updateTaskSchema, addTaskBatchSchema } from './todo.schema.js';
import type TodoController from './todo.controller.js';
import { auth } from '@/wireDependencies.js';

function createTodoRoute(todoController: TodoController) {
    const router = express.Router();

    router.get('/', auth, todoController.getAllHandler);
    router.post('/', zodParser(addTaskSchema), auth, todoController.addTaskHandler);

    // To be merged with above post endpoint later on
    router.post('/batch', zodParser(addTaskBatchSchema), auth, todoController.addTaskBatchHandler);
    
    router.get('/:taskId', zodParser(taskIdSchema, 'params'), auth, todoController.getOneHandler);
    router.patch('/:taskId', zodParser(taskIdSchema, 'params'), zodParser(updateTaskSchema), auth, todoController.updateTaskHandler);
    router.delete('/:taskId', zodParser(taskIdSchema, 'params'), auth, todoController.deleteTaskHandler);

    return router;
}

export default createTodoRoute;