import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.query;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ stake: user.stakeAmount ?? 0 });
}