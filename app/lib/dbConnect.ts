
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// A cached connection across hot-reloads in development to prevent connections from growing exponentially.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

let cached = global._mongooseConn;



export async function dbConnect(): Promise<typeof mongoose> {
  if (!cached) {
    cached = mongoose.connect(MONGODB_URI);
    global._mongooseConn = cached;

    cached
      .then(() => {
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ MongoDB connected");
        }
      })
      .catch((err : any) => {
        console.error("❌ MongoDB connection error:", err.message || err);
        global._mongooseConn = undefined;
        console.dir(err, { depth: null });
      });
  }

  try {
    return await cached;
  } catch (err) {
    // Ensure cache is cleared on failure
    global._mongooseConn = undefined;
    throw err;
  }
}

export async function dbDisconnect(): Promise<void> {
  // Only disconnect in non-production (for next dev) to allow fast reloads.
  if (process.env.NODE_ENV !== "production") {
    await mongoose.disconnect();
    global._mongooseConn = undefined;
  }
}