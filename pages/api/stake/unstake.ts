import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type UserData = {
  nullifierHash: string;
  balance: number;
  stake: number;
  stakeReward: number;
  lastStakeUpdate: number;
};

const DATA_PATH = path.resolve(process.cwd(), "user-data.json");

function loadUserData(): Record<string, UserData> {
  if (!fs.existsSync(DATA_PATH)) return {};
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  try { return JSON.parse(raw); } catch { return {}; }
}
function saveUserData(users: Record<string, UserData>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { nullifier_hash, amount } = req.body;
  if (!nullifier_hash || typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ error: "nullifier_hash and valid amount are required" });

  const users = loadUserData();
  let user = users[nullifier_hash];
  if (!user) return res.status(404).json({ error: "User not found" });
  if ((user.stake ?? 0) < amount)
    return res.status(400).json({ error: "Stake not enough" });

  // Hitung reward berjalan sebelum unstake
  const now = Date.now();
  const deltaSec = Math.max(0, Math.floor((now - (user.lastStakeUpdate ?? now)) / 1000));
  const apy = 0.7; // 70% per tahun
  const stakeRewardPerSec = (user.stake ?? 0) * (apy / 365 / 24 / 60 / 60);
  user.stakeReward = (user.stakeReward ?? 0) + deltaSec * stakeRewardPerSec;

  // Unstake
  user.stake -= amount;
  user.balance = (user.balance ?? 0) + amount;
  user.lastStakeUpdate = now;
  users[nullifier_hash] = user;
  saveUserData(users);

  res.status(200).json({
    stake: user.stake,
    balance: user.balance,
    stakeReward: user.stakeReward,
  });
}