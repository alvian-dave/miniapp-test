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
  if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  // Cek saldo wallet
  const contract = getErc20Contract();
  const decimals = await contract.decimals();
  const balance = await contract.balanceOf(user.walletAddress);
  const balanceNum = parseFloat(ethers.formatUnits(balance, decimals));
  if (balanceNum < amount) return res.status(400).json({ error: "Insufficient wallet balance" });

  // Transfer dari wallet user ke wallet owner (staking pool)
  const poolAddress = process.env.STAKING_POOL_ADDRESS!;
  try {
    // Di sini asumsikan user sudah approve/allowance, atau gunakan signature, dsb.
    // Demo: langsung update DB
    user.stakeAmount = (user.stakeAmount ?? 0) + amount;
    user.stakeStart = new Date();
    await user.save();
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: "Stake failed", detail: e.message });
  }
}