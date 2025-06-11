import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";
import { ethers } from "ethers";

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId } = req.body;
  const user = await User.findOne({ worldId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const provider = new ethers.JsonRpcProvider(process.env.WORLDCHAIN_RPC!);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(process.env.TOKEN_ADDRESS!, ERC20_ABI, signer);

  const decimals = await contract.decimals();
  const rewardAmount = "10"; // contoh reward
  const value = ethers.parseUnits(rewardAmount, decimals);

  try {
    const tx = await contract.transfer(user.walletAddress, value);
    await tx.wait();
    user.mainReward += Number(rewardAmount);
    await user.save();
    res.status(200).json({ success: true, hash: tx.hash });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to send token", detail: e.message });
  }
}