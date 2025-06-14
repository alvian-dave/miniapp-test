import type { NextApiRequest, NextApiResponse } from "next";
import { unstakeAll } from "@/lib/contract";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { nullifier_hash } = req.body;

    if (!nullifier_hash) {
      return res.status(400).json({ error: "Missing nullifier_hash" });
    }

    const tx = await unstakeAll(nullifier_hash);
    return res.status(200).json({ success: true, txHash: tx.transactionHash });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Unstake failed" });
  }
}
