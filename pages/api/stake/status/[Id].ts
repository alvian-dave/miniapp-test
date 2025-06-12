import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query; // ambil dari param URL

  const user = await User.findOne({ worldId: id }); // cari user di DB pakai worldId = id
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ stake: user.stakeAmount ?? 0 });
}