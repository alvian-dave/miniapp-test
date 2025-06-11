"use client";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useCallback } from "react";

type WorldIDLoginButtonProps = {
  onSuccess: (result: ISuccessResult) => void;
};

export default function WorldIDLoginButton({ onSuccess }: WorldIDLoginButtonProps) {
  const handleSuccess = useCallback(
    (result: ISuccessResult) => {
      onSuccess(result);
    },
    [onSuccess]
  );

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID!}
      action="log-in"
      onSuccess={handleSuccess}
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