import mongoose, { Mongoose } from 'mongoose';

const MONGO_URI = process.env.MONGO_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

const cached: MongooseConnection = (global as { mongoose?: MongooseConnection }).mongoose || {
    conn: null,
    promise: null,
};

export const connectDB = async () => {
    if (cached.conn) return cached.conn;
    if (!MONGO_URI) throw new Error('Mongo connection string not defined');

    cached.promise = cached.promise || mongoose.connect(MONGO_URI, { bufferCommands: false });
    cached.conn = await cached.promise;
    return cached.conn;
};