// pages/api/user/init.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { initContractProvider, initIfNeeded } from "@/lib/contract";

initContractProvider(process.env.RPC_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { payload, signal } = req.body;

  const worldIdHash = payload?.nullifier_hash;

  if (!worldIdHash || !signal) {
    console.warn("⚠️ Missing worldIdHash or signal:", { worldIdHash, signal });
    return res.status(400).json({ error: "Missing worldIdHash or signal" });
  }

  try {
    console.log("🔧 Initializing user with:", { worldIdHash, signal });
    const wasInitialized = await initIfNeeded(worldIdHash, signal);
    console.log("✅ Initialization result:", wasInitialized);

    return res.status(200).json({ initialized: wasInitialized });
  } catch (error: any) {
    console.error("❌ Init user failed:", error);
    return res.status(500).json({ error: "Failed to initialize user" });
  }
}
