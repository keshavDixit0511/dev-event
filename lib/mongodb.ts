import mongoose, { type ConnectOptions } from 'mongoose';

/**
 * MongoDB connection URI.
 *
 * Keep this value in your environment configuration (e.g. .env.local)
 * and NEVER hard-code credentials in source code.
 */
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside your environment configuration.');
}

/**
 * Shape of the cached Mongoose connection stored on the Node.js global object.
 *
 * Caching the connection prevents creating multiple connections during
 * Next.js hot-reloads in development and across API route re-usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-unused-vars
  var _mongooseCache: MongooseCache | undefined;
}

/**
 * Use a global variable in development to preserve the value across
 * module reloads. In production, the module is only loaded once per
 * server process so this is effectively a singleton.
 */
const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

/**
 * Establishes a cached Mongoose connection.
 *
 * Always call this function before interacting with any Mongoose models.
 * The function is safe to call multiple times; it will reuse the existing
 * connection if available.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // If we already have an active connection, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is not established yet, create (or reuse) the promise.
  if (!cached.promise) {
    const options: ConnectOptions = {
      // Disable mongoose's internal command buffering. This ensures
      // that operations fail fast if the connection is not ready.
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, options).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // Wait for the connection promise to resolve and cache the result.
  cached.conn = await cached.promise;

  return cached.conn;
}
