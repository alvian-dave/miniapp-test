import { ethers } from "ethers";
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];
export function getErc20Contract() {
  const provider = new ethers.JsonRpcProvider(process.env.WORLDCHAIN_RPC);
  return new ethers.Contract(process.env.TOKEN_ADDRESS!, ERC20_ABI, provider);
}