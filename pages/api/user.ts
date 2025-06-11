import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/mongo";
import User from "@/models/User";
import { getErc20Contract } from "@/lib/erc20";
import { ethers } from "ethers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { worldId, walletAddress, autoLogin } = req.body;
  let user = await User.findOne({ worldId });
  const now = new Date();

  if (!user) {
    user = await User.create({
      worldId,
      walletAddress,
      createdAt: now,
      lastLogin: now,
      mainReward: 0,
      stakingReward: 0,
      stakeStart: now,
      autoLogin: !!autoLogin,
    });
  } else {
    user.lastLogin = now;
    user.autoLogin = !!autoLogin;
    await user.save();
  }

  // Ambil saldo on-chain
  let onChainBalance = "0";
  try {
    const contract = getErc20Contract();
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    onChainBalance = ethers.formatUnits(balance, decimals);
    user.onChainBalance = onChainBalance;
    await user.save();
  } catch (e) {}

  // Kalkulasi reward staking berjalan
  const apy = 0.7; // 70% APY per tahun
  const days = (now.getTime() - user.stakeStart.getTime()) / (1000 * 3600 * 24);
  const stakingReward = user.stakingReward + (user.mainReward * apy * days / 365);

  res.status(200).json({
    ...user.toObject(),
    onChainBalance,
    stakingReward,
  });
}