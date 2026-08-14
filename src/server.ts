import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(import.meta.dirname, './config/.env')});

import app from './app.js';
import { connectDb, disconnectDb } from './config/dbConfig.js';

// Graceful termination of process

async function shutdown(SIGNAL: String, server:any): Promise<void> {
    console.log(`${SIGNAL} signal received.`);

    server.close(async () => {
        await disconnectDb();
        console.log('Shutting down...')
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 10000);

}

async function start(): Promise<void> {

    // Connect db
    try {
        await connectDb();
        console.log('Database connection establized');
    } catch(err) {
        console.error('Database not connected: ', err);
        throw err;
    }

    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Backend server started at http://localhost:${process.env.PORT}`);
    });

    process.on('SIGINT', () => shutdown('SIGINT', server));
    process.on('SIGTERM', () => shutdown('SIGTERM', server));
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception: ', err);
        shutdown('uncaughtException', server);
    });
    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection: ', err);
        shutdown('unhandledException', server);
    });
}

start();