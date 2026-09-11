import mongoose from "mongoose";
import { MongoClient, type Db } from "mongodb";

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as unknown as {
  __mongoose__?: Cache;
  __authDb__?: { client: MongoClient | null; db: Db | null; promise: Promise<Db> | null };
};
const cache: Cache = globalCache.__mongoose__ ?? { conn: null, promise: null };
const authCache = globalCache.__authDb__ ?? { client: null, db: null, promise: null };

if (!globalCache.__mongoose__) {
  globalCache.__mongoose__ = cache;
}
if (!globalCache.__authDb__) {
  globalCache.__authDb__ = authCache;
}

function authDbName(uri: string): string {
  try {
    const name = new URL(uri).pathname.replace(/^\//, "").split("?")[0];
    if (name) return name;
  } catch {
    /* ignore malformed uri */
  }
  return "project30";
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

export function getAuthDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  if (authCache.db) return Promise.resolve(authCache.db);
  if (!authCache.promise) {
    authCache.promise = (async () => {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      authCache.client = client;
      authCache.db = client.db(authDbName(uri));
      return authCache.db;
    })();
  }
  return authCache.promise;
}