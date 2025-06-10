import { useState, useEffect } from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

// Icon helper
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block align-middle mr-1">{children}</span>
);

const APY = 0.7; // 70% per tahun

export default function HomePage() {
  // State utama
  const [wallet, setWallet] = useState(0);
  const [claimable, setClaimable] = useState(0);
  const [staking, setStaking] = useState(0);
  const [inputStake, setInputStake] = useState("");
  const [reward, setReward] = useState(0);
  const [lastRewardUpdate, setLastRewardUpdate] = useState(Date.now());
  const [isVerified, setIsVerified] = useState(false);

  // Timer untuk update reward
  useEffect(() => {
    if (staking > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedSec = (now - lastRewardUpdate) / 1000;
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
  function handleWorldIdSuccess(_result: ISuccessResult) {
    setIsVerified(true);
    setWallet(0);
    setClaimable(100); // atau sesuai logika klaim
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
    setInputStake(wallet.toFixed(6));
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

  // Format angka
  function fmt(num: number) {
    return num.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  }

  // ================= LOGIN PAGE ========================
  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-cyan-200 via-blue-100 to-indigo-200 px-2">
        <div className="bg-white rounded-2xl shadow-xl p-7 max-w-xs w-full flex flex-col items-center">
          <span className="text-5xl mb-3">🌐</span>
          <h1 className="font-bold text-2xl text-center mb-2 text-gray-800">World Reward Coin</h1>
          <p className="text-center text-gray-600 mb-5 text-sm">Login terlebih dahulu menggunakan World ID untuk masuk ke dashboard miniapp.</p>
          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
            action="log-in"
            signal=""
            onSuccess={handleWorldIdSuccess}
          >
            {({ open }: { open: () => void }) => (
              <button
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow hover:from-blue-600 hover:to-blue-400 transition text-lg"
                onClick={open}
              >
                Login dengan World ID
              </button>
            )}
          </IDKitWidget>
        </div>
        <div className="text-xs text-gray-400 mt-8">© {new Date().getFullYear()} World Reward Coin</div>
      </div>
    );
  }

  // ================= DASHBOARD PAGE ========================
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-cyan-200 via-blue-100 to-indigo-200 py-6 px-2">
      <div className="flex flex-col items-center mb-5">
        <span className="text-4xl">🌐</span>
        <span className="font-bold text-3xl mt-2 text-gray-800 tracking-tight">World Reward Coin</span>
      </div>

      {/* CLAIM CARD */}
      <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md mb-5 border-t-4 border-green-400">
        <div className="flex items-center mb-2">
          <Icon>🪪</Icon>
          <span className="font-bold text-lg text-green-700">CLAIM</span>
        </div>
        <div className="flex items-center mb-1">
          <Icon>👛</Icon>
          <span className="font-semibold text-gray-800">Saldo Wallet:</span>
          <span className="font-mono ml-2 text-base text-gray-800">{fmt(wallet)} WRC</span>
        </div>
        <div className="flex items-center mb-3">
          <Icon>🎁</Icon>
          <span className="font-semibold text-gray-800">Klaim Tersedia:</span>
          <span className="font-mono ml-2 text-base text-green-600">{fmt(claimable)} WRC</span>
        </div>
        <button
          className="w-full py-2 mt-2 bg-emerald-500 text-white font-bold rounded shadow hover:bg-emerald-600 transition"
          onClick={handleClaim}
          disabled={claimable < 0.000001}
        >
          Claim Sekarang
        </button>
      </div>

      {/* STAKING CARD */}
      <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md mb-5 border-t-4 border-yellow-400">
        <div className="flex items-center mb-2">
          <Icon>💰</Icon>
          <span className="font-bold text-lg text-yellow-700">STAKING</span>
        </div>
        <div className="flex items-center mb-2">
          <Icon>🧪</Icon>
          <span className="font-semibold text-gray-800">Total Staking:</span>
          <span className="font-mono ml-2 text-base text-gray-800">{fmt(staking)} WRC</span>
          <button
            className="ml-2 text-xs px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded"
            onClick={handleMax}
            title="Stake Maksimal"
          >
            Max
          </button>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="number"
            min="0"
            max={wallet}
            value={inputStake}
            onChange={(e) => setInputStake(e.target.value)}
            placeholder="Jumlah yang ingin di-stake"
            className="flex-1 rounded border px-3 py-2 text-base mr-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-5 py-2 rounded transition"
            onClick={handleStake}
            disabled={!inputStake || parseFloat(inputStake) <= 0 || parseFloat(inputStake) > wallet}
          >
            Stake
          </button>
        </div>
        <button
          className="w-full py-2 mt-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded shadow transition"
          onClick={handleUnstakeAll}
          disabled={staking <= 0}
        >
          Tarik Semua
        </button>
      </div>

      {/* REWARD CARD */}
      <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md mb-5 border-t-4 border-purple-400">
        <div className="flex items-center mb-2">
          <Icon>🎉</Icon>
          <span className="font-bold text-lg text-purple-700">REWARD</span>
        </div>
        <div className="flex items-center mb-2">
          <Icon>✅</Icon>
          <span className="font-semibold text-gray-800">Reward Sekarang:</span>
          <span className="font-mono ml-2 text-base text-purple-700">{fmt(reward)} WRC</span>
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition"
            onClick={handleCompound}
            disabled={reward < 0.000001}
          >
            Compound Reward
          </button>
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
            onClick={handleClaimReward}
            disabled={reward < 0.000001}
          >
            Claim Reward
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">
          Reward berjalan otomatis sesuai APY 70% jika ada staking aktif.
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-6 mb-2">© {new Date().getFullYear()} World Reward Coin</div>
    </div>
  );
}