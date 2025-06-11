import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI!;
export async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { dbName: "miniapp" });
}