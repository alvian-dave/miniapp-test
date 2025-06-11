import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.body;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const now = new Date();
  const apy = 0.7; // 70% APY per tahun
  const days = (now.getTime() - user.stakeStart.getTime()) / (1000 * 3600 * 24);
  const stakingReward = user.stakingReward + (user.mainReward * apy * days / 365);

  user.stakingReward = stakingReward;
  user.stakeStart = now;
  await user.save();

  res.status(200).json({ stakingReward: user.stakingReward });
}