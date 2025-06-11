"use client";
import { MiniKit } from "@worldcoin/minikit-js";

export default function WorldIDLoginButton({ onSuccess }: { onSuccess: (result: any) => void }) {
  const handleLogin = async () => {
    try {
      const mk = new MiniKit();
      const result = await mk.connect();
      if (result) {
        onSuccess(result);
      }
    } catch (e) {
      alert("Login dibatalkan atau gagal.");
    }
  };

  return (
    <button
      className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow text-lg transition"
      onClick={handleLogin}
    >
      Connect with World ID
    </button>
  );
}