import { useState } from 'react';
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-2">
      {!nullifierHash ? (
        <div className="max-w-xs w-full py-12">
          <div className="bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center gap-6">
            <span className="text-5xl">🌐</span>
            <h1 className="font-bold text-2xl text-center">World Reward Coin</h1>
            <p className="mb-2 text-gray-600 text-center text-sm">
              Hubungkan World ID kamu untuk masuk ke dashboard MiniApp.
            </p>
            <IDKitWidget
              app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
              action="log-in"
              signal=""
              onSuccess={(result: ISuccessResult) => {
                setNullifierHash(result.nullifier_hash);
              }}
            >
              {({ open }: { open: () => void }) => (
                <button
                  className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow text-lg"
                  onClick={open}
                >
                  Connect with World ID
                </button>
              )}
            </IDKitWidget>
          </div>
        </div>
      ) : (
        <Dashboard nullifierHash={nullifierHash} />
      )}
    </div>
  );
}