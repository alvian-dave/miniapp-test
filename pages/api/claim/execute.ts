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
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { nullifier_hash } = req.body;
  if (!nullifier_hash) return res.status(400).json({ error: "nullifier_hash is required" });

  const users = loadUserData();
  let user = users[nullifier_hash];
  if (!user) return res.status(404).json({ error: "User not found" });

  const now = Date.now();
  const deltaSec = Math.max(0, Math.floor((now - user.lastUpdatedAt) / 1000));
  const rate = user.isOrb ? 0.000024 : 0.000012;
  const newReward = user.reward + deltaSec * rate;
  const claimed = newReward;

  user.balance = (user.balance || 0) + claimed;
  user.reward = 0;
  user.lastUpdatedAt = now;
  users[nullifier_hash] = user;
  saveUserData(users);

  res.status(200).json({ claimed, balance: user.balance });
}