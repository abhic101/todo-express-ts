// import { Sequelize } from 'sequelize';

// export const sequelize = new Sequelize(
//     process.env.DB_NAME as string,
//     process.env.DB_USER as string,
//     process.env.DB_PASSWORD as string,
//     {
//         host: process.env.DB_HOST || 'localhost',
//         port: Number(process.env.DB_HOST) || 5432,
//         dialect: 'postgres',
//         logging: false,
//         pool: {
//             max: 5,
//             min: 0,
//             acquire: 30000,
//             idle: 10000
//         }
//     }
// );

import mongoose from 'mongoose';

async function connectDb(): Promise<void> {
    await mongoose.connect(`mongodb://${process.env.DB_USER as string}:${process.env.DB_PASSWORD as string}@${process.env.DB_HOST as string}:${process.env.DB_PORT as string}/?authSource=${process.env.DB_NAME}`, {
        dbName: process.env.DB_NAME as string,
        maxPoolSize: 5,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
    });
    console.log(process.env.DB_NAME);

    mongoose.connection.on('disconnected', () => console.warn("Database disconnected"));
    mongoose.connection.on('error', (err) => console.error('MongoDB Error: ', err));
}

async function disconnectDb() : Promise<void> {
    await mongoose.disconnect();
}

export {
    connectDb, disconnectDb
}