import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import wireDependencies from '@/wireDependencies.js';
import createAuthRoute from '@features/auth/auth.route.js';
import createAccountRoute from "@features/account/account.route.js";
import createTodoRoute from '@features/todo/todo.route.js';
import { globalErrorHandler } from "@middlewares";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Creating and Mounting routes
const [authController, accountController, todoController] = wireDependencies();
app.use('/auth', createAuthRoute(authController));
app.use('/account', createAccountRoute(accountController));
app.use('/todo', createTodoRoute(todoController));

// Global Error handler
app.use(globalErrorHandler);

export default app;