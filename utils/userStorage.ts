export type UserData = {
  wallet: number
  claimable: number
  staking: number
  stakingReward: number
  reward: number
  lastUpdate: number
  loginAt: number
}

export function getUserIdFromProof(proof: any): string {
  // nullifier_hash adalah ID unik World ID user
  return proof?.nullifier_hash || ''
}

export function loadUserData(userId: string): UserData | null {
  if (!userId) return null
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem('user-' + userId)
  if (!raw) return null
  return JSON.parse(raw)
}

export function saveUserData(userId: string, data: UserData) {
  if (!userId) return
  if (typeof window === "undefined") return
  localStorage.setItem('user-' + userId, JSON.stringify(data))
}