// pages/api/stake/reward-status/[nullifierHash].ts
import { NextApiRequest, NextApiResponse } from "next";
import { dashboardReadContract } from "@/lib/contract";
import { ethers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query;

  if (!nullifierHash || typeof nullifierHash !== "string") {
    return res.status(400).json({ error: "Invalid nullifierHash" });
  }

  try {
    const reward = await dashboardReadContract.pendingStakingReward(nullifierHash);
    const formatted = ethers.formatUnits(reward, 18);
    return res.status(200).json({ stakeReward: formatted });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal error" });
  }
}
