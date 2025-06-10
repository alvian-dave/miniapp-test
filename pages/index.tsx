import { useState, useRef, useEffect } from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

const APY = 0.7; // 70% per tahun

export default function HomePage() {
  // State utama
  const [wallet, setWallet] = useState(10_000);
  const [claimable, setClaimable] = useState(100);
  const [staking, setStaking] = useState(0);
  const [inputStake, setInputStake] = useState("");
  const [reward, setReward] = useState(0);
  const [lastRewardUpdate, setLastRewardUpdate] = useState(Date.now());
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Timer untuk update reward
  useEffect(() => {
    if (staking > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedSec = (now - lastRewardUpdate) / 1000;
        // APY = 70% setahun, per detik: APY/365/24/3600
        const perSecondRate = APY / 365 / 24 / 3600;
        setReward((r) => r + staking * perSecondRate * elapsedSec);
        setLastRewardUpdate(now);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setLastRewardUpdate(Date.now());
    }
  }, [staking, lastRewardUpdate]);

  // Handler World ID success
  function handleWorldIdSuccess(result: ISuccessResult) {
    setIsVerified(true);
    // Rate claimable bisa disesuaikan jika ingin berbeda untuk orb/non-orb
    setClaimable(isVerified ? 200 : 100);
  }

  // Handler claim
  function handleClaim() {
    setWallet(wallet + claimable);
    setClaimable(0);
  }

  // Handler stake
  function handleStake() {
    const amount = parseFloat(inputStake);
    if (isNaN(amount) || amount <= 0 || amount > wallet) return;
    setWallet(wallet - amount);
    setStaking(staking + amount);
    setInputStake("");
    setLastRewardUpdate(Date.now());
  }

  // Handler tarik semua staking
  function handleUnstakeAll() {
    setWallet(wallet + staking);
    setStaking(0);
    setLastRewardUpdate(Date.now());
  }

  // Max button
  function handleMax() {
    setInputStake(wallet.toFixed(5));
  }

  // Compound reward
  function handleCompound() {
    setStaking(staking + reward);
    setReward(0);
    setLastRewardUpdate(Date.now());
  }

  // Claim reward ke wallet
  function handleClaimReward() {
    setWallet(wallet + reward);
    setReward(0);
    setLastRewardUpdate(Date.now());
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-700 flex flex-col items-center px-2 py-4">
      {/* Card utama */}
      <div className="w-full max-w-sm bg-white/80 rounded-2xl shadow-lg p-4 mt-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-14 w-14 flex items-center justify-center shadow">
            <span className="text-3xl">🌐</span>
          </div>
          <span className="font-bold text-xl mt-2 text-gray-800">World Reward Coin</span>
          <span className="text-xs text-gray-500">WRC Mini App</span>
        </div>

        {/* Wallet & Claim */}
        <div className="flex flex-col bg-slate-100 rounded-xl p-4 space-y-2 shadow">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Saldo Wallet</span>
            <span className="font-mono text-lg font-bold text-indigo-700">{wallet.toFixed(5)} WRC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Klaim Tersedia</span>
            <span className="font-mono text-lg font-bold text-green-600">{claimable.toFixed(5)} WRC</span>
          </div>
          <button
            className="w-full mt-2 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg shadow-lg active:scale-95 transition"
            onClick={handleClaim}
            disabled={claimable < 0.00001}
          >
            Claim
          </button>
        </div>

        {/* Staking */}
        <div className="bg-slate-100 rounded-xl p-4 shadow space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700">Total Staking</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-bold text-blue-600">{staking.toFixed(5)} WRC</span>
              <button
                className="px-2 py-0.5 bg-indigo-200 rounded text-xs font-bold text-indigo-800 hover:bg-indigo-300"
                onClick={handleMax}
                title="Stake Maksimal"
              >
                Max
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              min="0"
              max={wallet}
              value={inputStake}
              onChange={(e) => setInputStake(e.target.value)}
              placeholder="Jumlah staking"
              className="flex-1 rounded-lg border px-2 py-2 font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg active:scale-95 transition"
              onClick={handleStake}
              disabled={!inputStake || parseFloat(inputStake) <= 0 || parseFloat(inputStake) > wallet}
            >
              Stake
            </button>
          </div>
          <button
            className="w-full mt-2 py-2 bg-gradient-to-r from-pink-400 to-red-500 text-white font-bold rounded-lg shadow-md active:scale-95 transition"
            onClick={handleUnstakeAll}
            disabled={staking <= 0}
          >
            Tarik Semua
          </button>
        </div>

        {/* Reward */}
        <div className="bg-slate-100 rounded-xl p-4 shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Reward</span>
            <span className="font-mono text-lg font-bold text-amber-600">{reward.toFixed(5)} WRC</span>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg active:scale-95 transition"
              onClick={handleCompound}
              disabled={reward < 0.00001}
            >
              ⭐ Compound Reward
            </button>
            <button
              className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg active:scale-95 transition"
              onClick={handleClaimReward}
              disabled={reward < 0.00001}
            >
              ⬇️ Claim Reward
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">APY 70% • Reward berjalan jika ada staking</div>
        </div>

        {/* World ID Gate */}
        <div className="bg-slate-50 rounded-xl p-4 shadow flex flex-col items-center space-y-2">
          <span className="font-semibold text-gray-700">Verifikasi World ID</span>
          {isVerified ? (
            <span className="px-4 py-1 bg-green-200 text-green-700 rounded-lg font-bold">Terverifikasi</span>
          ) : (
            <IDKitWidget
              app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
              action="log-in"
              signal=""
              onSuccess={handleWorldIdSuccess}
            >
              {({ open }) => (
                <button
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold shadow active:scale-95 transition"
                  onClick={open}
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Login dengan World ID"}
                </button>
              )}
            </IDKitWidget>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-200 mt-6 opacity-50 text-center max-w-xs">
        © {new Date().getFullYear()} World Reward Coin Mini App.  
        <br />
        UI mobile & modern — Powered by TailwindCSS.
      </div>
    </div>
  );
}