import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ nullifierHash }) {
  const [claimable, setClaimable] = useState(0);
  const [balance, setBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [reward, setReward] = useState(0);
  const [stakeInput, setStakeInput] = useState('');
  const [loadingStake, setLoadingStake] = useState(false);

  useEffect(() => {
    const fetchStatus = () => {
      axios.get(`/api/claim/status/${nullifierHash}`).then(res => setClaimable(res.data.claimable));
      axios.get(`/api/stake/reward/${nullifierHash}`).then(res => setReward(res.data.reward));
      axios.get(`/api/user/wallet/${nullifierHash}`).then(res => setBalance(res.data.balance));
      axios.get(`/api/stake/total/${nullifierHash}`).then(res => setStakeAmount(res.data.total_stake));
    };
    const interval = setInterval(fetchStatus, 1000);
    fetchStatus();
    return () => clearInterval(interval);
  }, [nullifierHash]);

  const claim = async () => {
    const res = await axios.post('/api/claim/execute', { nullifier_hash: nullifierHash });
    alert(`Claimed ${res.data.claimed} WRC`);
  };

  const stake = async () => {
    setLoadingStake(true);
    try {
      const res = await axios.post('/api/stake', { nullifier_hash: nullifierHash, amount: parseFloat(stakeInput) });
      alert(`Staked ${res.data.staked} WRC (compounded ${res.data.compounded})`);
      setStakeInput('');
    } catch (e) {
      alert('Stake gagal. Pastikan jumlah valid.');
    } finally {
      setLoadingStake(false);
    }
  };

  const unstake = async () => {
    const res = await axios.post('/api/stake/unstake', { nullifier_hash: nullifierHash });
    alert(`Unstaked ${res.data.unstaked} WRC`);
  };

  const compound = async () => {
    const res = await axios.post('/api/stake/compound', { nullifier_hash: nullifierHash });
    alert(`Compounded ${res.data.compounded} WRC`);
  };

  const claimReward = async () => {
    const res = await axios.post('/api/stake/claim-reward', { nullifier_hash: nullifierHash });
    alert(`Claimed ${res.data.claimed} WRC`);
  };

  const handleStakeInputChange = (e) => {
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
            <p className="text-base sm:text-lg flex items-center gap-2">💼 Saldo Wallet: <span className="font-mono text-black">{balance.toFixed(6)}</span> WRC</p>
            <p className="text-base sm:text-lg flex items-center gap-2">🎁 Klaim Tersedia: <span className="font-mono text-green-600">{claimable.toFixed(6)}</span> WRC</p>
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm sm:text-base rounded-lg py-2 mt-2 font-bold" onClick={claim}>Claim Sekarang</button>
          </div>
        </div>

        {/* STAKING SECTION */}
        <div className="rounded-xl shadow-md border border-yellow-100 bg-white">
          <div className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-yellow-600 flex items-center gap-2">
              <span>💰</span> STAKING
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">📥 Total Staking: <span className="font-mono text-black">{stakeAmount.toFixed(6)}</span> WRC</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                className="bg-gray-100 text-black border-gray-300 focus:ring-teal-500 flex-1 rounded-lg px-3 py-2"
                placeholder="Jumlah yang ingin di-stake"
                value={stakeInput}
                onChange={handleStakeInputChange}
              />
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 font-bold"
                onClick={stake}
                disabled={loadingStake}
              >
                {loadingStake ? 'Loading...' : 'Stake'}
              </button>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-bold" onClick={unstake}>Tarik Semua</button>
          </div>
        </div>

        {/* REWARD SECTION */}
        <div className="rounded-xl shadow-md border border-purple-100 bg-white">
          <div className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-purple-600 flex items-center gap-2">
              <span>🎉</span> REWARD
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              💹 Reward Sekarang: <span className="font-mono text-yellow-600">{reward.toFixed(6)}</span> WRC
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-bold" onClick={compound}>Compound Reward</button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-bold" onClick={claimReward}>Claim Reward</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}