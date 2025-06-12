import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";
import { getErc20Contract } from "@/lib/erc20";
import { ethers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.query;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  let balance = "0";
  try {
    const contract = getErc20Contract();
    const bal = await contract.balanceOf(user.walletAddress);
    const decimals = await contract.decimals();
    balance = ethers.formatUnits(bal, decimals);
  } catch {}
  res.status(200).json({ balance });
}