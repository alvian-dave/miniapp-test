"use client";
import { MiniKit } from "@worldcoin/minikit-js";

export default function WorldIDLoginButton({ onSuccess }: { onSuccess: (result: any) => void }) {
  const handleLogin = async () => {
    try {
      const mk = new MiniKit({
        app_id: process.env.NEXT_PUBLIC_WORLDID_APP_ID, // pastikan sudah ada di .env.local
      });
      // Gunakan command wallet-auth untuk autentikasi user
      const result = await mk.command("wallet-auth");
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