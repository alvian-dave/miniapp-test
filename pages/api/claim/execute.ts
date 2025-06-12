import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";
import { getErc20Contract } from "@/lib/erc20";
import { ethers } from "ethers";

const CLAIM_RATE = 0.000001;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { nullifier_hash } = req.body;
  const user = await User.findOne({ worldId: nullifier_hash });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Hitung total reward yang bisa di-claim
  const now = Date.now();
  const last = user.lastClaimUpdate ? new Date(user.lastClaimUpdate).getTime() : now;
  const elapsed = (now - last) / 1000;
  const totalReward = (user.mainReward ?? 0) + (elapsed * CLAIM_RATE);

  if (totalReward <= 0) return res.status(400).json({ error: "No reward to claim" });

  try {
    const contract = getErc20Contract();
    const decimals = await contract.decimals();
    const value = ethers.parseUnits(totalReward.toString(), decimals);
    const tx = await contract.transfer(user.walletAddress, value);
    await tx.wait();

    // Reset reward
    user.mainReward = 0;
    user.lastClaimUpdate = new Date();
    await user.save();
    res.status(200).json({ success: true, hash: tx.hash });
  } catch (e: any) {
    res.status(500).json({ error: "Transfer failed", detail: e.message });
  }
}