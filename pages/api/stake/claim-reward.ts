import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";
import { getErc20Contract } from "@/lib/erc20";
import { ethers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.body;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Hitung total staking reward
  const apy = 0.7;
  const now = new Date();
  const days = (now.getTime() - user.stakeStart.getTime()) / (1000 * 3600 * 24);
  const totalReward = (user.stakeAmount ?? 0) * apy * days / 365 + (user.stakingReward ?? 0);
  if (totalReward <= 0) return res.status(400).json({ error: "No staking reward to claim" });

  try {
    const contract = getErc20Contract();
    const decimals = await contract.decimals();
    const value = ethers.parseUnits(totalReward.toString(), decimals);
    const tx = await contract.transfer(user.walletAddress, value);
    await tx.wait();

    user.stakingReward = 0;
    user.stakeStart = now;
    await user.save();
    res.status(200).json({ success: true, hash: tx.hash });
  } catch (e: any) {
    res.status(500).json({ error: "Transfer failed", detail: e.message });
  }
}