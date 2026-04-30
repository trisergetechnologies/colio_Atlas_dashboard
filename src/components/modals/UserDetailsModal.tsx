"use client";

import { getDefaultAvatarUrl, resolveImageUrl } from "@/utils/imageUrl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔒 Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !user) return null;

  const isConsultant = user.role === "consultant";
  const profileDocAvatar = user?.documents?.find((d: any) => d?.type === "profile_photo")?.url;
  const resolvedAvatar = resolveImageUrl(user.avatar || profileDocAvatar);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedAvatar}
              alt="avatar"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                (e.currentTarget as HTMLImageElement).src = getDefaultAvatarUrl();
              }}
            />
            <div>
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-dark-4 dark:text-dark-6">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-dark hover:opacity-70 dark:text-white"
          >
            ×
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {/* ---------- BASIC INFO ---------- */}
          <Section title="Basic Information">
            <Info label="Role" value={user.role} />
            <Info label="Status" value={user.isActive ? "Active" : "Inactive"} />
            <Info label="Verified" value={user.isVerified ? "Yes" : "No"} />
            <Info label="Phone" value={user.phone || "-"} />
            <Info label="Languages" value={user.languages?.join(", ") || "-"} />
            <Info
              label="Joined On"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </Section>

          {/* ---------- CONSULTANT (EXPERT) ---------- */}
          {isConsultant && (
            <>
              <Section title="Consultant Profile">
                <Info label="Bio" value={user.consultantProfile?.bio || "-"} />
                <Info
                  label="Category"
                  value={user.consultantProfile?.category || "-"}
                />
                <Info
                  label="Skills"
                  value={user.consultantProfile?.skills?.join(", ") || "-"}
                />
                <Info
                  label="Availability"
                  value={user.consultantProfile?.availabilityStatus || "-"}
                />
                <Info
                  label="Rating"
                  value={user.consultantProfile?.ratingAverage || 0}
                />
                <Info
                  label="Total Sessions"
                  value={user.consultantProfile?.totalSessions || 0}
                />
                <Info
                  label="Onboarding Score"
                  value={user.consultantProfile?.onboardingScore || 0}
                />
              </Section>

              <Section title="Rates">
                <Info
                  label="Voice / min"
                  value={`₹${user.consultantProfile?.ratePerMinute ?? "-"}`}
                />
                <Info
                  label="Video / min"
                  value={`₹${user.consultantProfile?.ratePerMinuteVideo ?? "-"}`}
                />
                <Info
                  label="Chat / min"
                  value={`₹${user.consultantProfile?.ratePerMinuteChat ?? "-"}`}
                />
              </Section>

              {/* ✅ CONSULTANT WALLET (ADDED) */}
              <Section title="Earnings Wallet">
                <Info
                  label="Available Balance"
                  value={`₹${user.consultantProfile?.wallet?.available || 0}`}
                />
                <Info
                  label="Pending Balance"
                  value={`₹${user.consultantProfile?.wallet?.pending || 0}`}
                />
                <Info
                  label="Total Earned"
                  value={`₹${user.consultantProfile?.wallet?.totalEarned || 0}`}
                />
              </Section>

              <Section title="Bank Details">
                <Info
                  label="Bank Verified"
                  value={
                    user.consultantProfile?.bankDetails?.isVerified
                      ? "Yes"
                      : "No"
                  }
                />
                <Info
                  label="Account Holder"
                  value={
                    user.consultantProfile?.bankDetails?.accountHolderName || "-"
                  }
                />
                <Info
                  label="Bank Name"
                  value={user.consultantProfile?.bankDetails?.bankName || "-"}
                />
                <Info
                  label="Account Number"
                  value={
                    user.consultantProfile?.bankDetails?.accountNumber
                      ? "••••••••" +
                        user.consultantProfile.bankDetails.accountNumber.slice(
                          -4
                        )
                      : "-"
                  }
                />
                <Info
                  label="IFSC"
                  value={user.consultantProfile?.bankDetails?.ifscCode || "-"}
                />
                <Info
                  label="UPI ID"
                  value={user.consultantProfile?.bankDetails?.upiId || "-"}
                />
              </Section>

              <Section title="Application & Documents">
                <Info
                  label="Application Status"
                  value={user.consultantProfile?.applicationStatus || "approved"}
                />
                <Info
                  label="Agreement"
                  value={
                    user.consultantProfile?.agreement?.signed
                      ? `Signed (${user.consultantProfile?.agreement?.version || "v1.0"})`
                      : "Not signed"
                  }
                />
              </Section>

              {!!user.documents?.length && (
                <Section title="Uploaded Documents">
                  <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                    {user.documents.map((doc: any, idx: number) => (
                      <div
                        key={`${doc.type}-${idx}`}
                        className="rounded-md border border-stroke p-2 dark:border-dark-3"
                      >
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-dark-4 dark:text-dark-6">
                          {doc.type}
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveImageUrl(doc.url)}
                          alt={doc.type}
                          className="h-28 w-full rounded object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* ---------- CUSTOMER ---------- */}
          {!isConsultant && (
            <>
              <Section title="Wallet">
                <Info label="Main Balance" value={`₹${user.wallet?.main || 0}`} />
                <Info label="Bonus" value={`₹${user.wallet?.bonus || 0}`} />
                <Info
                  label="Total Balance"
                  value={`₹${
                    (user.wallet?.main || 0) + (user.wallet?.bonus || 0)
                  }`}
                />
              </Section>

              <Section title="Referral">
                <Info label="Referral Code" value={user.referralCode || "-"} />
                <Info
                  label="Total Referrals"
                  value={user.totalReferrals || 0}
                />
              </Section>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ================= UI HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-base font-semibold text-dark dark:text-white">
        {title}
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="text-sm">
      <span className="block text-dark-4 dark:text-dark-6">{label}</span>
      <span className="font-medium text-dark dark:text-white">
        {value}
      </span>
    </div>
  );
}
