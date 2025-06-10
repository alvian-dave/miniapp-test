import { useEffect, useState } from 'react';
import axios from 'axios';

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

  const handleStakeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStakeInput(value);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-
