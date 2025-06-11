import { useState } from "react";
import WorldIDLoginButton from "@/components/WorldIDLoginButton";

interface WorldIDGateProps {
  onSuccess: (verification: any, isOrb: boolean) => void;
}

export default function WorldIDGate({ onSuccess }: WorldIDGateProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-3xl">🌐</span>
          <span className="text-2xl font-bold">World Reward Coin</span>
        </div>
        <p className="mb-4 text-center">
          Silakan login dengan <b>World ID</b> untuk melanjutkan.
        </p>
        <WorldIDLoginButton
          onSuccess={(result) => {
            setLoading(true);
            // Cek hasil response wallet-auth, jika tidak ada verification_level ganti dengan field lain
            // Sementara gunakan nullifier_hash saja
            onSuccess(result, false); // Atau deteksi sesuai field terbaru
          }}
        />
      </div>
    </div>
  );
}