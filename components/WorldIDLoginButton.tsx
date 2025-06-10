import React from "react";

export default function WorldIDLoginButton({ onSuccess }) {
  const handleLogin = async () => {
    if (typeof window !== "undefined" && window.worldApp && typeof window.worldApp.request === "function") {
      try {
        const result = await window.worldApp.request("world_id");
        onSuccess(result);
      } catch (err) {
        // Handle jika user batal/cancel
        alert("Login dibatalkan");
      }
    } else {
      alert("World App SDK tidak ditemukan. Coba buka lewat World App.");
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