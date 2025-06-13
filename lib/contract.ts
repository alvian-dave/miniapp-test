// lib/contract.ts
import { ethers } from "ethers";
import DashboardABI from "@/abi/WorldAppDashboard.json";
import ERC20ABI from "@/abi/ERC20.json";

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS!;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract for write (signer) and read (contract)
export const dashboardContract = new ethers.Contract(CONTRACT_ADDRESS, DashboardABI, signer);
export const dashboardReadContract = new ethers.Contract(CONTRACT_ADDRESS, DashboardABI, provider);

// ERC20 Token contract
export const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20ABI, provider);
