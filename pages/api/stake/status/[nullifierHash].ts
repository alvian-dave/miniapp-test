import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type UserData = {
  nullifierHash: string;
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
  const { nullifierHash } = req.query as { nullifierHash: string };
  if (!nullifierHash) return res.status(400).json({ error: "nullifierHash is required" });

  const users = loadUserData();
  let user = users[nullifierHash];
  if (!user) return res.status(404).json({ error: "User not found" });

  // Hitung reward staking berjalan
  const now = Date.now();
  const lastUpdate = user.lastStakeUpdate ?? now;
  const deltaSec = Math.floor((now - lastUpdate) / 1000);

  const apy = 0.7; // 70% per tahun
  const stake = user.stake ?? 0;
  // Reward per detik: stake * (APY / 365 hari / 24 jam / 60 menit / 60 detik)
  const rewardPerSecond = stake * (apy / 365 / 24 / 60 / 60);

  user.stakeReward = (user.stakeReward ?? 0) + deltaSec * rewardPerSecond;
  user.lastStakeUpdate = now;

  users[nullifierHash] = user;
  saveUserData(users);

  res.status(200).json({
    stake: user.stake ?? 0,
    stakeReward: user.stakeReward ?? 0,
    apy: apy,
  });
}