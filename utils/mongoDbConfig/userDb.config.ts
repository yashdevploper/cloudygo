import mongoose from "mongoose";

export default async function connect(): Promise<void> {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error("MongoDB connection error: MONGO_URI is not defined.");
    return;
  }

  try {
    const conn: typeof mongoose = await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.log("MongoDB connection error: ", err);
    process.exit(1);
  }
}
