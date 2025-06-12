import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

// Rate per second (misal 0.000001 WRC/detik)
const CLAIM_RATE = 0.000001;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query; // <<=== ini yang benar

  // Cari user dengan field worldId === id
  const user = await User.findOne({ worldId: id });
  if (!user) return res.status(404).json({ error: "User not found" });

  const now = Date.now();
  const last = user.lastClaimUpdate ? new Date(user.lastClaimUpdate).getTime() : now;
  const elapsed = (now - last) / 1000; // detik
  const claimable = (user.mainReward ?? 0) + (elapsed * CLAIM_RATE);

  res.status(200).json({ claimable });
}