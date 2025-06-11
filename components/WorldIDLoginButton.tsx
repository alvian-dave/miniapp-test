"use client";
import { MiniKitWorldID } from "@worldcoin/minikit-js";

export default function WorldIDLoginButton({ onSuccess }: { onSuccess: (result: any) => void }) {
  const handleLogin = async () => {
    try {
      const worldID = new MiniKitWorldID({
        app_id: process.env.NEXT_PUBLIC_WORLDID_APP_ID!, // pakai env kamu
        action: "login", // atau sesuai kebutuhan
      });
      const result = await worldID.verify();
      if (result) {
        onSuccess(result);
      }
    } catch (e) {
      alert("Login dibatalkan atau gagal.");
    }
  };

  return (
    <Button
      className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow text-lg transition"
      onClick={handleLogin}
    >
      Connect with World ID
    </Button>
  );
}