import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.body;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Compound: stakingReward ditambah ke mainReward, stakingReward di-reset 0
  const compounded = user.stakingReward;
  user.mainReward += compounded;
  user.stakingReward = 0;
  await user.save();

  res.status(200).json({ compounded });
}