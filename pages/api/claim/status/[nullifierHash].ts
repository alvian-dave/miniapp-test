import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type UserData = {
  nullifierHash: string;
  isOrb: boolean;
  reward: number;
  balance: number;
  stake: number;
  stakeReward: number;
  lastUpdatedAt: number;
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
  if (!user) {
    user = {
      nullifierHash,
      isOrb: false,
      reward: 0,
      balance: 0,
      stake: 0,
      stakeReward: 0,
      lastUpdatedAt: Date.now(),
      lastStakeUpdate: Date.now(),
    };
    users[nullifierHash] = user;
    saveUserData(users);
  }

  // === Kalkulasi reward berjalan ===
  const now = Date.now();
  const deltaSec = Math.max(0, Math.floor((now - user.lastUpdatedAt) / 1000));
  const rate = user.isOrb ? 0.000024 : 0.000012;
  user.reward += deltaSec * rate;
  user.lastUpdatedAt = now;
  users[nullifierHash] = user;
  saveUserData(users);

  res.status(200).json({
    claimable: user.reward,
    isOrb: user.isOrb,
    lastUpdatedAt: user.lastUpdatedAt,
    ratePerSecond: rate,
  });
}