import { useEffect, useState } from "react";

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

  return (
    <div>
      <h2>Token Dashboard</h2>
      <p>Address: {user.walletAddress}</p>
      <p>On-chain Balance: {onChainBalance}</p>
      <p>Reward utama: {mainReward}</p>
      <p>Staking berjalan: {stakingReward}</p>
      <button onClick={handleClaim}>Claim & Kirim Token</button>
      <button onClick={handleClaimStaking}>Claim Staking Reward</button>
    </div>
  );
}