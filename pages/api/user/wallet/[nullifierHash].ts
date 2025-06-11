import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type UserData = {
  nullifierHash: string;
  balance: number;
};

const DATA_PATH = path.resolve(process.cwd(), "user-data.json");

function loadUserData(): Record<string, UserData> {
  if (!fs.existsSync(DATA_PATH)) return {};
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  try { return JSON.parse(raw); } catch { return {}; }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query as { nullifierHash: string };
  if (!nullifierHash) return res.status(400).json({ error: "nullifierHash is required" });

  const users = loadUserData();
  let user = users[nullifierHash];
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ balance: user.balance || 0 });
}