import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";
import { getErc20Contract } from "@/lib/erc20";
import { ethers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { nullifier_hash, amount } = req.body;
  const user = await User.findOne({ worldId: nullifier_hash });
  if (!user) return res.status(404).json({ error: "User not found" });
  if ((user.stakeAmount ?? 0) < amount || amount <= 0) return res.status(400).json({ error: "Invalid unstake amount" });

  // Transfer dari pool ke wallet user
  try {
    // Demo: update DB saja
    user.stakeAmount = (user.stakeAmount ?? 0) - amount;
    await user.save();
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: "Unstake failed", detail: e.message });
  }
}