import { NextApiRequest, NextApiResponse } from "next";
import { getWallet } from "@/lib/contract"; // sesuai dengan letak aslimu

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query;

  if (!nullifierHash || typeof nullifierHash !== "string") {
    return res.status(400).json({ error: "Invalid nullifierHash" });
  }

  try {
    const wallet = await getWallet(nullifierHash);

    const isRegistered =
      wallet && wallet.toLowerCase() !== "0x0000000000000000000000000000000000000000";

    res.status(200).json({ registered: isRegistered, wallet });
  } catch (e: any) {
    console.error("Failed to check user registration:", e);
    res.status(500).json({ error: e.message || "Internal server error" });
  }
}
