import { NextApiRequest, NextApiResponse } from "next";
import { dashboardReadContract } from "@/lib/contract";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const nullifierHash = req.query.nullifierHash as string;

  if (!nullifierHash || typeof nullifierHash !== "string") {
    return res.status(400).json({ error: "Invalid nullifierHash" });
  }

  try {
    const wallet = await dashboardReadContract.withdrawWallet(nullifierHash);
    res.status(200).json({ wallet });
  } catch (e: any) {
    console.error("Error in is-registered API:", e);
    res.status(500).json({ error: e.message || "Internal server error" });
  }
}
