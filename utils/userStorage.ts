export type UserData = {
  nullifierHash: string;
  isOrb: boolean;
  mainReward: number;
  stakingBalance: number;
  stakingReward: number;
  lastUpdatedAt: number; // unix timestamp (ms)
  walletBalance: number; // saldo wallet utama
};

const STORAGE_KEY = "worldcoin-user";

export function getUserData(nullifierHash: string): UserData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${STORAGE_KEY}:${nullifierHash}`);
  return raw ? JSON.parse(raw) as UserData : null;
}

export function setUserData(data: UserData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY}:${data.nullifierHash}`, JSON.stringify(data));
}