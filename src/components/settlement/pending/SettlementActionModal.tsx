"use client";

import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import { useState } from "react";

export function SettlementActionModal({
  isOpen,
  onClose,
  settlement,
  onUpdated,
}: any) {
  const [utr, setUtr] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!isOpen || !settlement) return null;

  const approve = async () => {
    if (!utr) {
      setMessage({ type: "error", text: "UTR is required to approve settlement." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${settlement._id}/approve`,
        { utr },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "Settlement approved successfully." });
      onUpdated();
      setTimeout(onClose, 1200);
    } catch (e: any) {
      setMessage({
        type: "error",
        text: e?.response?.data?.message || "Approval failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!reason) {
      setMessage({ type: "error", text: "Rejection reason is required." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${settlement._id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "Settlement rejected successfully." });
      onUpdated();
      setTimeout(onClose, 1200);
    } catch (e: any) {
      setMessage({
        type: "error",
        text: e?.response?.data?.message || "Rejection failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const bank = settlement.bankSnapshot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Header */}
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Settlement Review
        </h3>

        {/* Info */}
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-dark-4 dark:text-dark-6">
            Consultant:{" "}
            <span className="font-medium text-dark dark:text-white">
              {settlement.consultant?.name}
            </span>
          </p>
          <p className="text-dark-4 dark:text-dark-6">
            Email: {settlement.consultant?.email}
          </p>
          <p className="mt-1 text-base font-semibold text-green-600 dark:text-green-400">
            Amount: ₹{settlement.amount}
          </p>
        </div>

        {/* Bank Snapshot */}
        <div className="mt-4 rounded-md border border-stroke bg-gray-2 p-4 text-sm dark:border-dark-3 dark:bg-dark-2">
          <p className="mb-2 font-semibold text-dark dark:text-white">
            Bank Details (Snapshot)
          </p>
          <div className="space-y-1 text-dark-4 dark:text-dark-6">
            <p>Account Holder: {bank?.accountHolderName}</p>
            <p>Bank: {bank?.bankName}</p>
            <p>Account No: {bank?.accountNumber}</p>
            <p>IFSC: {bank?.ifscCode}</p>
            {bank?.upiId && <p>UPI: {bank.upiId}</p>}
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-4 space-y-3">
          <input
            placeholder="Enter UTR to approve"
            value={utr}
            onChange={(e) => setUtr(e.target.value.toUpperCase())}
            className="w-full rounded-md border border-stroke px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />

          <textarea
            placeholder="Enter rejection reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-md border border-stroke px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            rows={3}
          />
        </div>

        {/* Feedback */}
        {message && (
          <div
            className={`mt-4 rounded-md px-4 py-2 text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={reject}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
          >
            Reject
          </button>

          <button
            disabled={loading}
            onClick={approve}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
