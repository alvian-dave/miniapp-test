import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.body;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Compound reward ke staking balance
  const now = new Date();
  const apy = 0.7;
  const days = (now.getTime() - user.stakeStart.getTime()) / (1000 * 3600 * 24);
  const newReward = (user.stakeAmount ?? 0) * apy * days / 365 + (user.stakingReward ?? 0);

  user.stakeAmount = (user.stakeAmount ?? 0) + newReward;
  user.stakingReward = 0;
  user.stakeStart = now;
  await user.save();

  res.status(200).json({ compounded: newReward });
}