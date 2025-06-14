import { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { MiniKit, VerificationLevel, ISuccessResult } from "@worldcoin/minikit-js";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "log-in", // sama seperti di IDKitWidget sebelumnya
        verification_level: VerificationLevel.Orb,
        signal: undifiend, // optional, bisa pakai string statik
      });

      if (finalPayload.status === "error") {
        throw new Error("Verification rejected");
      }

      const result = finalPayload as ISuccessResult;

      const res = await fetch("/api/user/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldIdHash: result.nullifier_hash,
          signal: walletAddress, // signal sebagai wallet
        }),
      });

      if (!res.ok) throw new Error("Init failed");

      router.push(`/dashboard?nullifier=${result.nullifier_hash}`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-cyan-200 via-blue-100 to-indigo-200 px-2">
      <Card className="rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center">
        <CardContent className="flex flex-col items-center p-0 w-full">
          <span className="text-5xl mb-3">🌐</span>
          <h1 className="font-bold text-2xl text-center mb-2 text-gray-800">
            World Reward Coin
          </h1>
          <p className="text-center text-gray-600 mb-5 text-sm">
            Connect your World ID to claim reward.
          </p>
          <button
            className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow text-lg transition"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Connect with World ID"}
          </button>
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} World Reward Coin
      </div>
    </div>
  );
}
