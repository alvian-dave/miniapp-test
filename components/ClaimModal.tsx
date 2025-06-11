import React from "react";

interface ClaimModalProps {
  open: boolean;
  onClose: () => void;
  onClaim: () => void;
  amount: number;
}

export default function ClaimModal({ open, onClose, onClaim, amount }: ClaimModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded shadow-lg w-80 p-6">
        <h2 className="text-xl font-bold mb-2">Claim Confirmation</h2>
        <p className="mb-4">Are you sure you want to claim? <b>{amount.toFixed(6)} WRC</b>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Batal</button>
          <button onClick={() => { onClaim(); onClose(); }} className="px-4 py-2 rounded bg-teal-600 text-white">Claim</button>
        </div>
      </div>
    </div>
  );
}