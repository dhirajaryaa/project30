import mongoose from "mongoose";

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as unknown as { __mongoose__?: Cache };
const cache: Cache = globalCache.__mongoose__ ?? { conn: null, promise: null };

if (!globalCache.__mongoose__) {
  globalCache.__mongoose__ = cache;
}

export async function connectDb(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch {
    cache.promise = null;
    cache.conn = null;
    return null;
  }
  return cache.conn;
}