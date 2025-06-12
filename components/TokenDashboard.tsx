import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  user: any;
};

export default function TokenDashboard({ user }: Props) {
  const [stakingReward, setStakingReward] = useState(user.stakingReward);
  const [mainReward, setMainReward] = useState(user.mainReward);
  const [onChainBalance, setOnChainBalance] = useState(user.onChainBalance);

  async function handleClaim() {
    const res = await fetch("/api/send-reward", {
      method: "POST",
      body: JSON.stringify({ worldId: user.worldId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      alert("Claim failed: " + data.error);
    }
  }

  async function handleClaimStaking() {
    const res = await fetch("/api/staking", {
      method: "POST",
      body: JSON.stringify({ worldId: user.worldId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setStakingReward(data.stakingReward);
  }

  // Format 6 digit
  const six = (num: number) => (num ?? 0).toFixed(6);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto grid gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">🌐 Token Dashboard</h1>
        {/* MAIN REWARD */}
        <Card className="border-teal-100">
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-700 flex items-center gap-2">
              <span role="img" aria-label="gift">🎁</span> Main Reward
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="wallet">💼</span> On-chain Balance: <span className="font-mono text-black">{six(onChainBalance)}</span>
            </p>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="gift">🎁</span> Reward utama: <span className="font-mono text-green-600">{six(mainReward)}</span>
            </p>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm sm:text-base rounded-lg py-2 mt-2 font-bold"
              onClick={handleClaim}
            >
              Claim & Kirim Token
            </Button>
          </CardContent>
        </Card>
        {/* STAKING REWARD */}
        <Card className="border-yellow-100">
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-yellow-600 flex items-center gap-2">
              <span role="img" aria-label="moneybag">💰</span> Staking Reward
            </h2>
            <p className="text-base sm:text-lg flex items-center gap-2">
              <span role="img" aria-label="chart">💹</span> Staking berjalan: <span className="font-mono text-yellow-600">{six(stakingReward)}</span>
            </p>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-bold"
              onClick={handleClaimStaking}
            >
              Claim Staking Reward
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}