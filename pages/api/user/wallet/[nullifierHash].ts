import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import contractABI from "../../../abi/WorldAppDashboard.json";
import erc20ABI from "../../../abi/ERC20.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
const RPC_URL = process.env.RPC_URL as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { nullifierHash } = req.query;
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    const token = new ethers.Contract(TOKEN_ADDRESS, erc20ABI, provider);

    const wallet = await contract.withdrawWallet(nullifierHash);
    if (wallet === ethers.ZeroAddress) return res.json({ balance: "0" });
    const balance = await token.balanceOf(wallet);
    res.json({ balance: ethers.formatUnits(balance, 18) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}