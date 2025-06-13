import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import contractABI from "../../../abi/WorldAppDashboard.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const RPC_URL = process.env.RPC_URL as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nullifierHash } = req.query;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    const stakingData = await contract.stakingUsers(nullifierHash);
    const staked = ethers.formatUnits(stakingData.staked, 18);
    const stakingReward = await contract.pendingStakingReward(nullifierHash);
    res.json({
      stake: staked,
      stakeReward: ethers.formatUnits(stakingReward, 18)
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}