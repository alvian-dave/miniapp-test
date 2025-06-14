import type { NextApiRequest, NextApiResponse } from "next";
import { compoundReward } from "@/lib/contract";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { worldId } = req.body;

    if (!worldId) {
      return res.status(400).json({ error: "Missing worldId" });
    }

    const tx = await compoundReward(worldId);
    return res.status(200).json({ success: true, txHash: tx.transactionHash });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Compound failed" });
  }
}
