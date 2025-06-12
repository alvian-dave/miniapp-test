import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DashboardProps {
  nullifierHash: string;
}

export default function Dashboard({ nullifierHash }: DashboardProps) {
  const [walletBalance, setWalletBalance] = useState(0);
  const [claimable, setClaimable] = useState(0);
  const [stakingBalance, setStakingBalance] = useState(0);
  const [stakingReward, setStakingReward] = useState(0);

  const [stakeInput, setStakeInput] = useState('');
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const [loadingCompound, setLoadingCompound] = useState(false);
  const [loadingClaimReward, setLoadingClaimReward] = useState(false);

  // for staking reward animation
  const rewardBase = useRef(0);
  const rewardLastUpdate = useRef(Date.now());

  // user auto-init (for first time only)
  const initUser = async () => {
    if (!nullifierHash) return;
    try {
      await axios.post('/api/user/init', {
        worldId: nullifierHash,
      });
    } catch {}
  };

  // fetch all balances
  const fetchAll = async () => {
    if (!nullifierHash) return;
    try {
      // Wallet balance (dummy if not available)
      try {
        const walletRes = await axios.get(`/api/user/wallet/${nullifierHash}`);
        setWalletBalance(parseFloat(walletRes.data.balance ?? '0'));
      } catch {
        setWalletBalance(0);
      }

      // claimable
      try {
        const claimRes = await axios.get(`/api/claim/status/${nullifierHash}`);
        setClaimable(parseFloat(claimRes.data.claimable ?? '0'));
      } catch { setClaimable(0); }

      // stakingBalance
      try {
        const stakeRes = await axios.get(`/api/stake/status/${nullifierHash}`);
        setStakingBalance(parseFloat(stakeRes.data.stake ?? '0'));
      } catch { setStakingBalance(0); }

      // stakingReward
      try {
        const rewardRes = await axios.get(`/api/stake/reward-status/${nullifierHash}`);
        setStakingReward(parseFloat(rewardRes.data.stakeReward ?? '0'));
        rewardBase.current = parseFloat(rewardRes.data.stakeReward ?? '0');
        rewardLastUpdate.current = Date.now();
      } catch { setStakingReward(0); }
    } catch {}
  };

  useEffect(() => {
    initUser();
    // eslint-disable-next-line
  }, [nullifierHash]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, [nullifierHash]);

  // animasi staking reward APY
  useEffect(() => {
    const apy = 0.7;
    let animationId: number;
    const updateReward = () => {
      const now = Date.now();
      const elapsed = (now - rewardLastUpdate.current) / 1000;
      const reward = rewardBase.current + (stakingBalance * apy * elapsed) / (365 * 24 * 3600);
      setStakingReward(reward);
      animationId = window.requestAnimationFrame(updateReward);
    };
    animationId = window.requestAnimationFrame(updateReward);
    return () => window.cancelAnimationFrame(animationId);
    // eslint-disable-next-line
  }, [stakingBalance, rewardBase.current]);

  // Format 6 digit
  const six = (num: number) => (num ?? 0).toFixed(6);

  // HANDLERS
  const handleClaim = async () => {
    setLoadingClaim(true);
    try {
      await axios.post('/api/claim/execute', { nullifier_hash: nullifierHash });
      await fetchAll();
      alert('Claim success!');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Claim failed!');
    }
    setLoadingClaim(false);
  };

  const handleStake = async () => {
    if (!stakeInput || isNaN(Number(stakeInput)) || Number(stakeInput) <= 0) return;
    setLoadingStake(true);
    try {
      await axios.post('/api/stake/execute', {
        nullifier_hash: nullifierHash,
        amount: parseFloat(stakeInput)
      });
      await fetchAll();
      setStakeInput('');
      alert('Stake success!');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Stake failed!');
    }
    setLoadingStake(false);
  };

  const handleUnstake = async () => {
    if (stakingBalance <= 0) return;
    setLoadingUnstake(true);
    try {
      await axios.post('/api/stake/unstake', {
        nullifier_hash: nullifierHash,
        amount: stakingBalance
      });
      await fetchAll();
      alert('Unstake success!');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Unstake failed!');
    }
    setLoadingUnstake(false);
  };

  const handleCompound = async () => {
    setLoadingCompound(true);
    try {
      await axios.post('/api/stake/compound', { worldId: nullifierHash });
      await fetchAll();
      alert('Compound success!');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Compound failed!');
    }
    setLoadingCompound(false);
  };

  const handleClaimReward = async () => {
    setLoadingClaimReward(true);
    try {
      await axios.post('/api/stake/claim-reward', { worldId: nullifierHash });
      await fetchAll();
      alert('Claim staking reward success!');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Claim reward failed!');
    }
    setLoadingClaimReward(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto grid gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">🌐 World Reward Coin</h1>
        {/* CLAIM SECTION */}
        <Card className="border-teal-100">
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700 flex items-center gap-2">
              <span role="img" aria-label="bank">🏛️</span> CLAIM
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="wallet">💼</span> Wallet Balance: <span className="font-mono text-black">{six(walletBalance)}</span> WRC
            </p>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="gift">🎁</span> Available to claim: <span className="font-mono text-green-600">{six(claimable)}</span> WRC
            </p>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm sm:text-base rounded-lg py-2 mt-2 font-bold"
              onClick={handleClaim}
              disabled={loadingClaim || claimable <= 0}
            >
              {loadingClaim ? "Processing..." : "Claim now"}
            </Button>
          </CardContent>
        </Card>
        {/* STAKING SECTION */}
        <Card className="border-yellow-100">
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-yellow-600 flex items-center gap-2">
              <span role="img" aria-label="moneybag">💰</span> STAKING
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="deposit">📥</span> Staking Balance: <span className="font-mono text-black">{six(stakingBalance)}</span> WRC
            </p>
            <Input
              className="bg-gray-100 text-black border-gray-300 focus:ring-teal-500 flex-1 rounded-lg px-3 py-2"
              placeholder="Enter the amount you want to stake"
              value={stakeInput}
              onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value)) setStakeInput(e.target.value); }}
              disabled={loadingStake}
            />
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 font-bold"
              onClick={handleStake}
              disabled={loadingStake || !stakeInput || Number(stakeInput) <= 0 || Number(stakeInput) > walletBalance}
            >
              {loadingStake ? "Processing..." : "Stake"}
            </Button>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-bold"
              onClick={handleUnstake}
              disabled={loadingUnstake || stakingBalance <= 0}
            >
              {loadingUnstake ? "Processing..." : "Unstake All"}
            </Button>
          </CardContent>
        </Card>
        {/* REWARD SECTION */}
        <Card className="border-purple-100">
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-purple-600 flex items-center gap-2">
              <span role="img" aria-label="confetti">🎉</span> REWARD
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="chart">💹</span> Staking Reward: <span className="font-mono text-yellow-600">{six(stakingReward)}</span> WRC
            </p>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-bold"
              onClick={handleCompound}
              disabled={loadingCompound || stakingReward <= 0}
            >
              {loadingCompound ? "Processing..." : "Compound Reward"}
            </Button>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-bold"
              onClick={handleClaimReward}
              disabled={loadingClaimReward || stakingReward <= 0}
            >
              {loadingClaimReward ? "Processing..." : "Claim Reward"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}