import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connects to MongoDB Atlas via Mongoose.
 * Subsequent calls are no-ops if already connected.
 */
export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas unreachable
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', (err as Error).message);
    throw err;
  }
};

/**
 * Returns the Mongoose connection readyState as a human-readable string.
 *  0 = disconnected | 1 = connected | 2 = connecting | 3 = disconnecting
 */
export const getMongoStatus = (): { readyState: number; status: string } => {
  const readyState = mongoose.connection.readyState;
  const labels: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return { readyState, status: labels[readyState] ?? 'unknown' };
};

export default mongoose;
