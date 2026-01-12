"use client";

import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import { useState } from "react";

export function GeneratePendingSettlementsModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (
      !confirm(
        "This will move ALL eligible consultants' available balance to pending settlements.\n\nDo you want to continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/create-pending`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        `Settlement generation completed.\n\nCreated: ${res.data.created}\nSkipped: ${res.data.skipped?.length || 0}`
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to generate settlements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-dark">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Generate Pending Settlements
        </h3>

        <p className="mt-3 text-sm text-dark-4 dark:text-dark-6">
          This action will:
          <ul className="mt-2 list-disc pl-5">
            <li>Create pending settlements for all eligible consultants</li>
            <li>Move available wallet balance to pending</li>
            <li>Require manual approval later</li>
          </ul>
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleGenerate}
            className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm & Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
