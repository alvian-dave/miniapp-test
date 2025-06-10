import { useState } from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);

  // Jika sudah verifikasi, langsung dashboard
  if (nullifierHash) {
    return <Dashboard nullifierHash={nullifierHash} />;
  }

  // Halaman login modern
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-cyan-200 via-blue-100 to-indigo-200 px-2">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center">
        <span className="text-5xl mb-3">🌐</span>
        <h1 className="font-bold text-2xl text-center mb-2 text-gray-800">World Reward Coin</h1>
        <p className="text-center text-gray-600 mb-5 text-sm">
          Hubungkan World ID kamu untuk masuk ke dashboard MiniApp.
        </p>
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
          action="log-in"
          signal=""
          onSuccess={(result: ISuccessResult) => setNullifierHash(result.nullifier_hash)}
        >
          {({ open }: { open: () => void }) => (
            <button
              className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow text-lg transition"
              onClick={open}
            >
              Connect with World ID
            </button>
          )}
        </IDKitWidget>
      </div>
      <div className="text-xs text-gray-400 mt-8">© {new Date().getFullYear()} World Reward Coin</div>
    </div>
  );
}