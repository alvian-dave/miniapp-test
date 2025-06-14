import type { NextApiRequest, NextApiResponse } from "next";
import { stakeWithWorldID } from "@/lib/contract";
import { ethers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { signal, root, nullifierHash, proof, worldIdHash, amount } = req.body;

    if (!signal || !root || !nullifierHash || !proof || !worldIdHash || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);
    const tx = await stakeWithWorldID(signal, root, nullifierHash, proof, worldIdHash, parsedAmount);

    return res.status(200).json({ success: true, txHash: tx.transactionHash });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Stake failed" });
  }
}
