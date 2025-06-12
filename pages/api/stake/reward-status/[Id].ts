import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.query;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const apy = 0.7;
  const now = new Date();
  const lastStake = user.stakeStart ?? user.createdAt ?? now;
  const days = (now.getTime() - lastStake.getTime()) / (1000 * 3600 * 24);
  const stakeReward = (user.stakeAmount ?? 0) * apy * days / 365 + (user.stakingReward ?? 0);

  res.status(200).json({ stakeReward });
}