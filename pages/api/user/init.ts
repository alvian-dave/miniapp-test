// pages/api/user/init.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { initContractProvider, initIfNeeded } from "@/lib/contract";

initContractProvider(process.env.RPC_URL!); // Inisialisasi provider & signer di awal

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Logging isi body yang diterima dari frontend
  console.log("🔍 Incoming request body:", req.body);

  const { worldIdHash, wallet } = req.body;

  if (!worldIdHash || !wallet) {
    console.warn("⚠️ Missing worldIdHash or wallet:", { worldIdHash, wallet });
    return res.status(400).json({ error: "Missing worldIdHash or wallet" });
  }

  try {
    console.log("🔧 Initializing user with:", { worldIdHash, wallet });
    const wasInitialized = await initIfNeeded(worldIdHash, wallet);
    console.log("✅ Initialization result:", wasInitialized);

    return res.status(200).json({ initialized: wasInitialized });
  } catch (error: any) {
    console.error("❌ Init user failed:", error);
    return res.status(500).json({ error: "Failed to initialize user" });
  }
}
