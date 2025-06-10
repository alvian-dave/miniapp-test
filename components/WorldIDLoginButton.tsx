import React from "react";

export default function WorldIDLoginButton({ onSuccess }: { onSuccess: (result: any) => void }) {
  const handleLogin = async () => {
    if (typeof window !== "undefined" && (window as any).worldApp) {
      try {
        const result = await (window as any).worldApp.request("world_id");
        onSuccess(result);
      } catch (err) {
        alert("User cancelled or error: " + (err as Error).message);
      }
    } else {
      // Fallback jika bukan di World App: redirect ke QR scan (sesuaikan/fallback lain jika perlu)
      window.location.href = "https://id.worldcoin.org/verify";
    }
  };

  return (
    <button className="px-4 py-2 font-bold rounded bg-black text-white" onClick={handleLogin}>
      Connect with World ID
    </button>
  );
}