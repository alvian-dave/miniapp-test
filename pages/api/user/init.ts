import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb"; // pastikan path sudah benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { worldId } = req.body;
  if (!worldId) {
    return res.status(400).json({ error: "Missing worldId" });
  }

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("users").updateOne(
      { worldId },
      { $setOnInsert: { worldId, createdAt: new Date() } },
      { upsert: true }
    );
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Insert failed" });
  }
}