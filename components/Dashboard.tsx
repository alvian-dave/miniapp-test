import { useEffect, useRef, useState } from "react"
import ClaimModal from "./ClaimModal"
import RewardModal from "./RewardModal"
import { getRateByUser } from "../utils/coinRate"
import { getUserIdFromProof, loadUserData, saveUserData, UserData } from "../utils/userStorage"

const APY = 0.7
const SECONDS_IN_YEAR = 31536000

type Props = {
  isOrbVerified: boolean
  worldIDProof: any
}

export default function Dashboard({ isOrbVerified, worldIDProof }: Props) {
  // Per-user state
  const userId = getUserIdFromProof(worldIDProof)
  const [wallet, setWallet] = useState(0)
  const [claimable, setClaimable] = useState(0)
  const [staking, setStaking] = useState(0)
  const [stakingReward, setStakingReward] = useState(0)
  const [reward, setReward] = useState(0)
  const [loginAt, setLoginAt] = useState(Date.now())
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [stakeInput, setStakeInput] = useState("")

  // Timestamp update
  const lastUpdate = useRef(Date.now())

  // Load data user dari localStorage saat komponen mount
  useEffect(() => {
    if (!userId) return
    const data = loadUserData(userId)
    if (data) {
      setWallet(data.wallet)
      setClaimable(data.claimable)
      setStaking(data.staking)
      setStakingReward(data.stakingReward)
      setReward(data.reward)
      setLoginAt(data.loginAt)
      lastUpdate.current = data.lastUpdate
    } else {
      // User baru: catat waktu login awal
      setWallet(0)
      setClaimable(0)
      setStaking(0)
      setStakingReward(0)
      setReward(0)
      setLoginAt(Date.now())
      lastUpdate.current = Date.now()
      saveUserData(userId, {
        wallet: 0,
        claimable: 0,
        staking: 0,
        stakingReward: 0,
        reward: 0,
        lastUpdate: Date.now(),
        loginAt: Date.now(),
      })
    }
    // eslint-disable-next-line
  }, [userId])

  // Update reward tiap detik & persist
  useEffect(() => {
    if (!userId) return
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - lastUpdate.current) / 1000
      lastUpdate.current = now

      const rate = getRateByUser(isOrbVerified)
      setClaimable((c) => c + rate * elapsed)
      setReward((r) => r + rate * elapsed)
      setStakingReward((sr) => sr + staking * (Math.pow(1 + APY, elapsed / SECONDS_IN_YEAR) - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [isOrbVerified, staking, userId])

  // Persist setiap ada perubahan state utama
  useEffect(() => {
    if (!userId) return
    saveUserData(userId, {
      wallet, claimable, staking, stakingReward, reward,
      lastUpdate: lastUpdate.current,
      loginAt,
    })
  }, [userId, wallet, claimable, staking, stakingReward, reward, loginAt])

  function handleStake() {
    const amount = parseFloat(stakeInput)
    if (!isNaN(amount) && amount > 0 && amount <= wallet) {
      setWallet((w) => w - amount)
      setStaking((s) => s + amount)
      setStakeInput("")
    }
  }

  function handleUnstakeAll() {
    setWallet((w) => w + staking + stakingReward)
    setStaking(0)
    setStakingReward(0)
  }

  function handleClaim() {
    setWallet((w) => w + claimable)
    setClaimable(0)
  }

  function handleClaimReward() {
    setWallet((w) => w + reward)
    setReward(0)
  }

  function handleCompoundReward() {
    setStaking((s) => s + reward)
    setReward(0)
  }

  function handleClaimStakingReward() {
    setWallet((w) => w + stakingReward)
    setStakingReward(0)
  }

  function handleCompoundStakingReward() {
    setStaking((s) => s + stakingReward)
    setStakingReward(0)
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-3xl">🌐</span>
        <h1 className="text-3xl font-bold">World Reward Coin</h1>
      </div>

      {/* CLAIM */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-green-700 font-bold mb-2 text-xl">🪙 CLAIM</h2>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-brown-700">👛</span>
          <span>Saldo Wallet:</span>
          <b>{wallet.toFixed(6)} WRC</b>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-orange-700">🎁</span>
          <span>Klaim Tersedia:</span>
          <b className="text-green-600">{claimable.toFixed(6)} WRC</b>
        </div>
        <button
          className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
          onClick={() => setShowClaimModal(true)}
        >
          Claim Sekarang
        </button>
      </div>
      <ClaimModal
        open={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onClaim={handleClaim}
        amount={claimable}
      />

      {/* STAKING */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-yellow-700 font-bold mb-2 text-xl">🥇 STAKING</h2>
        <div className="mb-2 flex items-center gap-2">
          <span>🧪</span>
          <span>Total Staking:</span>
          <b>{staking.toFixed(6)} WRC</b>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span>💰</span>
          <span>Reward Staking:</span>
          <b className="text-yellow-600">{stakingReward.toFixed(6)} WRC</b>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 border rounded"
            type="number"
            min="0"
            placeholder="Jumlah yang ingin di-stake"
            value={stakeInput}
            onChange={e => setStakeInput(e.target.value)}
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleStake}
          >
            Stake
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            onClick={handleCompoundStakingReward}
            disabled={stakingReward === 0}
          >
            Compound Reward
          </button>
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            onClick={handleClaimStakingReward}
            disabled={stakingReward === 0}
          >
            Claim Reward
          </button>
        </div>
        <button
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          onClick={handleUnstakeAll}
        >
          Tarik Semua
        </button>
      </div>

      {/* REWARD */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-purple-700 font-bold mb-2 text-xl">🥕 REWARD</h2>
        <div className="mb-4 flex items-center gap-2">
          <span>✅</span>
          <span>Reward Sekarang:</span>
          <b className="text-purple-600">{reward.toFixed(6)} WRC</b>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            onClick={handleCompoundReward}
          >
            Compound Reward
          </button>
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            onClick={() => setShowRewardModal(true)}
          >
            Claim Reward
          </button>
        </div>
      </div>
      <RewardModal
        open={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onClaim={handleClaimReward}
        amount={reward}
      />
    </div>
  );
}