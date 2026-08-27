import UserModel from './models/user.model.js';
import UserRepository from './repositories/user.repository.js'
import { default as RefreshTokenModel} from './models/refreshToken.model.js';
import RefreshTokenRepository from './repositories/refreshToken.repository.js';
import TaskModel from './models/task.model.js';
import TaskRepository from '@repositories/task.repository.js';
import wireAuthFeature from './features/auth/auth.wiring.js';
import wireAccountFeature from './features/account/account.wiring.js';
import wireTodoFeature from './features/todo/todo.wiring.js';

import AuthMiddleware from './middlewares/auth.js';

let auth:any;

function wireDependencies(): Array<any> {
    const userRepository = new UserRepository(UserModel);
    const taskRepository = new TaskRepository(TaskModel);
    const refreshTokenRepository = new RefreshTokenRepository(RefreshTokenModel);

    const authController = wireAuthFeature(UserModel, userRepository, RefreshTokenModel, refreshTokenRepository);
    const accountController = wireAccountFeature(UserModel, userRepository);
    const todoController = wireTodoFeature(TaskModel, taskRepository);

    const authMiddleware = new AuthMiddleware(userRepository, refreshTokenRepository);
    auth = authMiddleware.auth;

    return [authController, accountController, todoController];
}

export default wireDependencies;
export {
    auth
}