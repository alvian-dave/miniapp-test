import { useState } from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

interface WorldIDGateProps {
  onSuccess: (verification: ISuccessResult, isOrb: boolean) => void;
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
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
          action="log-in"
          signal=""
          onSuccess={(result: ISuccessResult) => {
            setLoading(true);
            onSuccess(result, result.verification_level === "orb");
          }}
        >
          {({ open }: { open: () => void }) => ( // <--- tambahkan tipe di sini
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={open}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login dengan World ID"}
            </button>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
}