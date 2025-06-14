// components/Dashboard.tsx
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
  const [loading, setLoading] = useState({
    claim: false,
    stake: false,
    unstake: false,
    compound: false,
    reward: false
  });

  const rewardBase = useRef(0);
  const rewardLastUpdate = useRef(Date.now());

  const fetchAll = async () => {
    try {
      const [walletRes, claimRes, stakeRes, rewardRes] = await Promise.all([
        axios.get(`/api/user/wallet/${nullifierHash}`),
        axios.get(`/api/claim/status/${nullifierHash}`),
        axios.get(`/api/stake/status/${nullifierHash}`),
        axios.get(`/api/stake/reward-status/${nullifierHash}`)
      ]);
      setWalletBalance(parseFloat(walletRes.data.balance ?? '0'));
      setClaimable(parseFloat(claimRes.data.claimable ?? '0'));
      setStakingBalance(parseFloat(stakeRes.data.stake ?? '0'));
      const rewardVal = parseFloat(rewardRes.data.stakeReward ?? '0');
      setStakingReward(rewardVal);
      rewardBase.current = rewardVal;
      rewardLastUpdate.current = Date.now();
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const initUser = async () => {
    try {
      const check = await axios.get(`/api/user/wallet/${nullifierHash}`);
      if (check.data?.wallet === "0x0000000000000000000000000000000000000000") {
        await axios.post('/api/user/init', { nullifierHash });
        console.log("User initialized");
      }
    } catch (err) {
      console.error("User init error", err);
    }
  };

  useEffect(() => {
    initUser();
  }, [nullifierHash]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, [nullifierHash]);

  useEffect(() => {
    const apy = 0.7;
    let anim: number;
    const animateReward = () => {
      const now = Date.now();
      const elapsed = (now - rewardLastUpdate.current) / 1000;
      const reward = rewardBase.current + (stakingBalance * apy * elapsed) / (365 * 24 * 3600);
      setStakingReward(reward);
      anim = requestAnimationFrame(animateReward);
    };
    anim = requestAnimationFrame(animateReward);
    return () => cancelAnimationFrame(anim);
  }, [stakingBalance]);

  const six = (n: number) => (n ?? 0).toFixed(6);

  const post = async (url: string, data?: object, key: keyof typeof loading) => {
    setLoading(l => ({ ...l, [key]: true }));
    try {
      await axios.post(url, { nullifier_hash: nullifierHash, ...data });
      await fetchAll();
      alert(`${key} success!`);
    } catch (e: any) {
      alert(e?.response?.data?.error || `${key} failed!`);
    }
    setLoading(l => ({ ...l, [key]: false }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto grid gap-4 sm:gap-6">
        <h1 className="text-3xl font-bold text-center">🌐 World Reward Coin</h1>

        <Card>
          <CardContent className="space-y-3 p-4">
            <h2 className="text-xl font-semibold text-teal-700">🏛️ CLAIM</h2>
            <p>💼 Wallet Balance: <span className="font-mono">{six(walletBalance)} WRC</span></p>
            <p>🎁 Claimable: <span className="font-mono text-green-600">{six(claimable)} WRC</span></p>
            <Button onClick={() => post('/api/claim/execute', {}, 'claim')} disabled={loading.claim || claimable <= 0}>
              {loading.claim ? 'Processing...' : 'Claim'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <h2 className="text-xl font-semibold text-yellow-600">💰 STAKING</h2>
            <p>📥 Balance: <span className="font-mono">{six(stakingBalance)} WRC</span></p>
            <Input value={stakeInput} onChange={e => {
              const val = e.target.value;
              if (/^\d*\.?\d*$/.test(val)) setStakeInput(val);
            }} placeholder="Stake amount" />
            <Button onClick={() => post('/api/stake/execute', { amount: parseFloat(stakeInput) }, 'stake')}
              disabled={loading.stake || !stakeInput || parseFloat(stakeInput) <= 0}>
              {loading.stake ? "Staking..." : "Stake"}
            </Button>
            <Button onClick={() => post('/api/stake/unstake', { amount: stakingBalance }, 'unstake')} disabled={loading.unstake || stakingBalance <= 0}>
              {loading.unstake ? "Unstaking..." : "Unstake All"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <h2 className="text-xl font-semibold text-purple-600">🎉 REWARD</h2>
            <p>💹 Reward: <span className="font-mono">{six(stakingReward)} WRC</span></p>
            <Button onClick={() => post('/api/stake/compound', { worldId: nullifierHash }, 'compound')} disabled={loading.compound || stakingReward <= 0}>
              {loading.compound ? "Processing..." : "Compound"}
            </Button>
            <Button onClick={() => post('/api/stake/claim-reward', { worldId: nullifierHash }, 'reward')} disabled={loading.reward || stakingReward <= 0}>
              {loading.reward ? "Processing..." : "Claim Reward"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
