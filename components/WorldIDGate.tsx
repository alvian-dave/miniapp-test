"use client";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useRouter } from "next/navigation";

export default function WorldIDLoginButton() {
  const router = useRouter();

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
      action="login"
      onSuccess={(result: ISuccessResult) => {
        // result sudah mengandung nullifier_hash dsb, bisa kamu proses jika perlu
        router.push("/dashboard"); // Ganti "/dashboard" dengan path dashboard-mu
      }}
    >
      {({ open }) => (
        <button
          className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg shadow text-lg transition"
          onClick={open}
          type="button"
        >
          Connect with World ID
        </button>
      )}
    </IDKitWidget>
  );
}