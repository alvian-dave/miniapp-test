import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import contractABI from "../../abi/WorldAppDashboard.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const RPC_URL = process.env.RPC_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { nullifierHash } = req.body;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    const tx = await contract.claimStakingReward(nullifierHash);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}