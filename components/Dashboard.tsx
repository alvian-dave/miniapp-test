import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DashboardProps {
  nullifierHash: string;
}

export default function Dashboard({ nullifierHash }: DashboardProps) {
  const [claimable, setClaimable] = useState(0);
  const [balance, setBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [reward, setReward] = useState(0);
  const [stakeInput, setStakeInput] = useState('');
  const [loadingStake, setLoadingStake] = useState(false);

  // Fetch reward berjalan tiap detik
  useEffect(() => {
    const fetchClaimable = () => {
      axios.get(`/api/claim/status/${nullifierHash}`)
        .then(res => setClaimable(res.data.claimable));
    };
    const interval = setInterval(fetchClaimable, 1000);
    fetchClaimable();
    return () => clearInterval(interval);
  }, [nullifierHash]);

  // Fetch saldo wallet
  const fetchBalance = async () => {
    const res = await axios.get(`/api/user/wallet/${nullifierHash}`);
    setBalance(res.data.balance);
  };

  // Fetch status staking (stake & reward staking)
  const fetchStakeStatus = async () => {
    const res = await axios.get(`/api/stake/status/${nullifierHash}`);
    setStakeAmount(res.data.stake);
    setReward(res.data.stakeReward);
  };

  // Fetch balance & stake status saat mount, dan polling tiap detik
  useEffect(() => {
    fetchBalance();
    fetchStakeStatus();
    const interval = setInterval(fetchStakeStatus, 1000);
    return () => clearInterval(interval);
  }, [nullifierHash]);

  // Handler claim
  const claim = async () => {
    const res = await axios.post('/api/claim/execute', { nullifier_hash: nullifierHash });
    alert(`Claimed ${res.data.claimed} WRC`);
    fetchBalance();
  };

  // Handler stake
  const stake = async () => {
    setLoadingStake(true);
    try {
      const res = await axios.post('/api/stake/execute', { nullifier_hash: nullifierHash, amount: parseFloat(stakeInput) });
      alert(`Staked ${res.data.stake} WRC`);
      setStakeInput('');
      fetchBalance();
      fetchStakeStatus();
    } catch (e) {
      alert('Stake gagal. Pastikan jumlah valid.');
    } finally {
      setLoadingStake(false);
    }
  };

  // Handler unstake
  const unstake = async () => {
    const res = await axios.post('/api/stake/unstake', { nullifier_hash: nullifierHash, amount: stakeAmount });
    alert(`Unstaked ${res.data.stake} WRC`);
    fetchBalance();
    fetchStakeStatus();
  };

  // Handler compound
  const compound = async () => {
    // Misal endpoint compound mengkonversi reward staking menjadi stake baru
    // (implementasikan endpoint /api/stake/compound jika belum ada)
    const res = await axios.post('/api/stake/compound', { nullifier_hash: nullifierHash });
    alert(`Compounded ${res.data.compounded} WRC`);
    fetchBalance();
    fetchStakeStatus();
  };

  // Handler claim reward staking
  const claimReward = async () => {
    // Misal endpoint claim-reward memindahkan reward staking ke wallet user
    // (implementasikan endpoint /api/stake/claim-reward jika belum ada)
    const res = await axios.post('/api/stake/claim-reward', { nullifier_hash: nullifierHash });
    alert(`Claimed ${res.data.claimed} WRC`);
    fetchBalance();
    fetchStakeStatus();
  };

  const handleStakeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStakeInput(value);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto grid gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">🌐 World Reward Coin</h1>

        {/* CLAIM SECTION */}
        <div className="rounded-xl shadow-md border border-teal-100 bg-white">
          <div className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700 flex items-center gap-2">
              <span>🪙</span> CLAIM
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              💼 Saldo Wallet: <span className="font-mono text-black">{balance.toFixed(6)}</span> WRC
            </p>
            <p className="text-base sm:text-lg flex items-center gap-2">
              🎁 Klaim Tersedia: <span className="font-mono text-green-600">{claimable.toFixed(6)}</span> WRC
            </p>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm sm:text-base rounded-lg py-2 mt-2 font-bold"
              onClick={claim}
            >
              Claim Sekarang
            </Button>
          </div>
        </div>

        {/* STAKING SECTION */}
        <div className="rounded-xl shadow-md border border-yellow-100 bg-white">
          <div className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-yellow-600 flex items-center gap-2">
              <span>💰</span> STAKING
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              📥 Total Staking: <span className="font-mono text-black">{stakeAmount.toFixed(6)}</span> WRC
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                className="bg-gray-100 text-black border-gray-300 focus:ring-teal-500 flex-1 rounded-lg px-3 py-2"
                placeholder="Jumlah yang ingin di-stake"
                value={stakeInput}
                onChange={handleStakeInputChange}
              />
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 font-bold"
                onClick={stake}
                disabled={loadingStake}
              >
                {loadingStake ? 'Loading...' : 'Stake'}
              </Button>
            </div>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-bold"
              onClick={unstake}
              disabled={stakeAmount === 0}
            >
              Tarik Semua
            </Button>
          </div>
        </div>

        {/* REWARD SECTION */}
        <div className="rounded-xl shadow-md border border-purple-100 bg-white">
          <div className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-purple-600 flex items-center gap-2">
              <span>🎉</span> REWARD
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              💹 Reward Staking: <span className="font-mono text-yellow-600">{reward.toFixed(6)}</span> WRC
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-bold"
                onClick={compound}
              >
                Compound Reward
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-bold"
                onClick={claimReward}
              >
                Claim Reward
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}