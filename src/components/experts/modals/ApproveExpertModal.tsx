"use client";

import { getToken } from "@/utils/tokenHelper";
import { resolveImageUrl } from "@/utils/imageUrl";
import axios from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  expert: any | null;
  onDone: () => void;
};

export function ApproveExpertModal({ isOpen, onClose, expert, onDone }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingScore, setOnboardingScore] = useState(80);
  const [ratePerMinute, setRatePerMinute] = useState(15);
  const [ratePerMinuteVideo, setRatePerMinuteVideo] = useState(25);
  const [ratePerMinuteChat, setRatePerMinuteChat] = useState(10);
  const [rejectReason, setRejectReason] = useState("");

  if (typeof document === "undefined" || !isOpen || !expert) return null;

  const agr = expert.consultantProfile?.agreement;
  const docByType = (t: string) =>
    expert.documents?.find((d: { type: string }) => d.type === t)?.url;

  const downloadPdf = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/consultants/${expert._id}/agreement.pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agreement-${expert.name || "expert"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Download failed");
    }
  };

  const approve = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/consultants/${expert._id}/approve`,
        {
          onboardingScore: Number(onboardingScore),
          ratePerMinute: Number(ratePerMinute),
          ratePerMinuteVideo: Number(ratePerMinuteVideo),
          ratePerMinuteChat: Number(ratePerMinuteChat),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data?.success) throw new Error(res.data?.message || "Approve failed");
      onDone();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/consultants/${expert._id}/reject`,
        { rejectionReason: rejectReason.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data?.success) throw new Error(res.data?.message || "Reject failed");
      onDone();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Reject failed");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Review application — {expert.name}</h3>
          <button type="button" onClick={onClose} className="text-2xl leading-none">
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">{expert.email}</p>

        <div className="mt-4 rounded border border-stroke p-3 dark:border-dark-3">
          <div className="text-sm font-semibold">Agreement</div>
          {agr?.signed ? (
            <div className="mt-2 space-y-2 text-sm">
              <p>
                Signed by <strong>{agr.signedName}</strong>
                {agr.signedAt &&
                  ` on ${new Date(agr.signedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}`}
                {agr.version && ` (${agr.version})`}
              </p>
              <button
                type="button"
                onClick={downloadPdf}
                className="rounded bg-primary px-3 py-1.5 text-sm text-white"
              >
                Download Agreement (PDF)
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-amber-700">No signed agreement (admin-direct onboard).</p>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["aadhaar_front", "Aadhaar front"],
            ["aadhaar_back", "Aadhaar back"],
            ["pan", "PAN"],
            ["profile_photo", "Profile photo"],
          ].map(([type, label]) => {
            const url = docByType(type);
            const resolvedUrl = resolveImageUrl(url);
            return (
              <div key={type} className="rounded border border-stroke p-2 dark:border-dark-3">
                <div className="text-xs font-medium">{label}</div>
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvedUrl}
                    alt={label}
                    className="mt-2 max-h-40 w-full rounded object-contain"
                  />
                ) : (
                  <p className="text-xs text-gray-500">Missing</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Onboarding score (0–100)</span>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-2 dark:bg-dark-2"
              value={onboardingScore}
              onChange={(e) => setOnboardingScore(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Voice ₹/min</span>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-2 dark:bg-dark-2"
              value={ratePerMinute}
              onChange={(e) => setRatePerMinute(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Video ₹/min</span>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-2 dark:bg-dark-2"
              value={ratePerMinuteVideo}
              onChange={(e) => setRatePerMinuteVideo(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Chat ₹/min</span>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-2 dark:bg-dark-2"
              value={ratePerMinuteChat}
              onChange={(e) => setRatePerMinuteChat(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm">
            <span className="font-medium">Rejection reason (optional)</span>
            <textarea
              className="mt-1 w-full rounded border px-2 py-2 dark:bg-dark-2"
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Only filled when rejecting"
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={reject}
            className="rounded border border-red-500 px-4 py-2 text-sm text-red-600"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={approve}
            className="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "…" : "Approve"}
          </button>
        </div>
        {!agr?.signed && (
          <p className="mt-2 text-xs text-amber-700">
            Warning: no digital agreement on file. Only approve if you have verified this application
            through other means.
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
