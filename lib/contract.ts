// lib/contract.ts
import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/abi/abi";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

let provider: ethers.providers.JsonRpcProvider;
let signer: ethers.Wallet;
let contract: ethers.Contract;

export function initContractProvider(rpcUrl: string) {
  provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  signer = new ethers.Wallet(PRIVATE_KEY, provider);
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export function getContract() {
  return contract;
}

export function getProvider() {
  return provider;
}

export function getSigner() {
  return signer;
}

// === Fungsi khusus sesuai smart contract ===


export async function getWallet(worldIdHash: string): Promise<string> {
  return await contract.withdrawWallet(worldIdHash);
}

export async function getBalance(wallet: string): Promise<string> {
  const balance = await contract.balanceOf(wallet);
  return ethers.utils.formatUnits(balance, 18);
}

export async function getClaimable(worldIdHash: string): Promise<string> {
  const reward = await getPendingWorldReward(worldIdHash);
  return ethers.utils.formatUnits(reward, 18);
}

export async function getStakingBalance(worldIdHash: string): Promise<string> {
  const staking = await contract.userStake(worldIdHash);
  return ethers.utils.formatUnits(staking, 18);
}

export async function getPendingReward(worldIdHash: string): Promise<string> {
  const reward = await getPendingStakingReward(worldIdHash);
  return ethers.utils.formatUnits(reward, 18);
}


export async function getPendingWorldReward(worldIdHash: string): Promise<ethers.BigNumber> {
  return await contract.pendingWorldReward(worldIdHash);
}

export async function getPendingStakingReward(worldIdHash: string): Promise<ethers.BigNumber> {
  return await contract.pendingStakingReward(worldIdHash);
}

export async function setWithdrawWallet(worldIdHash: string, wallet: string) {
  const tx = await contract.setWithdrawWallet(worldIdHash, wallet);
  return await tx.wait();
}

export async function claimStakingReward(worldIdHash: string) {
  const tx = await contract.claimStakingReward(worldIdHash);
  return await tx.wait();
}

export async function compoundReward(worldIdHash: string) {
  const tx = await contract.compound(worldIdHash);
  return await tx.wait();
}

export async function unstakeAll(worldIdHash: string) {
  const tx = await contract.unstakeAll(worldIdHash);
  return await tx.wait();
}

export async function claimWorldRewardWithWorldID(
  signal: string,
  root: string,
  nullifierHash: string,
  proof: [string, string, string, string, string, string, string, string],
  worldIdHash: string
) {
  const tx = await contract.claimWorldRewardWithWorldID(
    signal,
    root,
    nullifierHash,
    proof,
    worldIdHash
  );
  return await tx.wait();
}

export async function stakeWithWorldID(
  signal: string,
  root: string,
  nullifierHash: string,
  proof: [string, string, string, string, string, string, string, string],
  worldIdHash: string,
  amount: ethers.BigNumberish
) {
  const tx = await contract.stakeWithWorldID(
    signal,
    root,
    nullifierHash,
    proof,
    worldIdHash,
    amount
  );
  return await tx.wait();
}

// === Register/init user jika belum tercatat ===

export async function isUserRegistered(worldIdHash: string): Promise<boolean> {
  const wallet = await contract.withdrawWallet(worldIdHash);
  return wallet !== ethers.constants.AddressZero;
}

export async function initIfNeeded(worldIdHash: string, wallet: string): Promise<boolean> {
  const already = await isUserRegistered(worldIdHash);
  if (!already) {
    const tx = await contract.setWithdrawWallet(worldIdHash, wallet);
    await tx.wait();
    return true;
  }
  return false;
}
