"use client";

import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface UpdateExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: any | null;
  onUpdated?: (updatedExpert: any) => void; // optional callback
}

export function UpdateExpertModal({
  isOpen,
  onClose,
  expert,
  onUpdated,
}: UpdateExpertModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= FORM STATE =================
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefill form when expert changes
  useEffect(() => {
    if (expert) {
      setForm({
        name: expert.name || "",
        email: expert.email || "",
        phone: expert.phone || "",
        gender: expert.gender || "",
        languages: expert.languages || [],
        isActive: expert.isActive ?? true,
        isVerified: expert.isVerified ?? false,

        bio: expert.consultantProfile?.bio || "",
        skills: expert.consultantProfile?.skills || [],
        onboardingScore: expert.consultantProfile?.onboardingScore || 0,
        availabilityStatus:
          expert.consultantProfile?.availabilityStatus || "offWork",

        ratePerMinute: expert.consultantProfile?.ratePerMinute || 0,
        ratePerMinuteVideo: expert.consultantProfile?.ratePerMinuteVideo || 0,
        ratePerMinuteChat: expert.consultantProfile?.ratePerMinuteChat || 0,

        bankDetails: {
          accountHolderName:
            expert.consultantProfile?.bankDetails?.accountHolderName || "",
          bankName: expert.consultantProfile?.bankDetails?.bankName || "",
          accountNumber:
            expert.consultantProfile?.bankDetails?.accountNumber || "",
          ifscCode: expert.consultantProfile?.bankDetails?.ifscCode || "",
          upiId: expert.consultantProfile?.bankDetails?.upiId || "",
          isVerified:
            expert.consultantProfile?.bankDetails?.isVerified || false,
        },
      });
    }
  }, [expert]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !expert) return null;

  // ================= HANDLERS =================
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/updateconsultant/${expert._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Update failed");
      }

      onUpdated?.(res.data.data);
      onClose();
    } catch (err: any) {
      console.error("Update consultant error:", err);
      setError(err?.response?.data?.message || "Failed to update consultant");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Update Expert Details
          </h3>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-dark dark:text-white"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
          {/* BASIC */}
          <Section title="Basic Information">
            <Input
              label="Name"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
            />
            <Input
              label="Email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) => handleChange("phone", v)}
            />
            <Select
              label="Gender"
              value={form.gender}
              options={["male", "female", "other"]}
              onChange={(v) => handleChange("gender", v)}
            />
            <Toggle
              label="Active"
              checked={form.isActive}
              onChange={(v) => handleChange("isActive", v)}
            />
            <Toggle
              label="Verified"
              checked={form.isVerified}
              onChange={(v) => handleChange("isVerified", v)}
            />
          </Section>

          {/* PROFILE */}
          <Section title="Consultant Profile">
            <Textarea
              label="Bio"
              value={form.bio}
              onChange={(v) => handleChange("bio", v)}
            />
            {/* <Input
              label="Skills (comma separated)"
              value={form.skills.join(", ")}
              onChange={(v) =>
                handleChange(
                  "skills",
                  v.split(",").map((s) => s.trim())
                )
              }
            /> */}
            <Input
              label="Onboarding Score"
              type="number"
              value={form.onboardingScore}
              onChange={(v) => handleChange("onboardingScore", Number(v))}
            />
            <Select
              label="Availability"
              value={form.availabilityStatus}
              options={["onWork", "offWork", "busy"]}
              onChange={(v) => handleChange("availabilityStatus", v)}
            />
          </Section>

          {/* RATES */}
          <Section title="Rates (₹ per minute)">
            <Input
              label="Voice"
              type="number"
              value={form.ratePerMinute}
              onChange={(v) => handleChange("ratePerMinute", Number(v))}
            />
            <Input
              label="Video"
              type="number"
              value={form.ratePerMinuteVideo}
              onChange={(v) => handleChange("ratePerMinuteVideo", Number(v))}
            />
            <Input
              label="Chat"
              type="number"
              value={form.ratePerMinuteChat}
              onChange={(v) => handleChange("ratePerMinuteChat", Number(v))}
            />
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <Input
              label="Account Holder Name"
              value={form.bankDetails?.accountHolderName}
              onChange={(v) =>
                handleChange("bankDetails", {
                  ...form.bankDetails,
                  accountHolderName: v,
                })
              }
            />

            <Input
              label="Bank Name"
              value={form.bankDetails?.bankName}
              onChange={(v) =>
                handleChange("bankDetails", {
                  ...form.bankDetails,
                  bankName: v,
                })
              }
            />

            <Input
              label="Account Number"
              value={form.bankDetails?.accountNumber}
              onChange={(v) =>
                handleChange("bankDetails", {
                  ...form.bankDetails,
                  accountNumber: v,
                })
              }
            />

            <Input
              label="IFSC Code"
              value={form.bankDetails?.ifscCode}
              onChange={(v) =>
                handleChange("bankDetails", {
                  ...form.bankDetails,
                  ifscCode: v.toUpperCase(),
                })
              }
            />

            <Input
              label="UPI ID"
              value={form.bankDetails?.upiId}
              onChange={(v) =>
                handleChange("bankDetails", {
                  ...form.bankDetails,
                  upiId: v,
                })
              }
            />

            <Toggle
              label="Bank Verified"
              checked={form.bankDetails?.isVerified}
              onChange={(v) =>
                handleChange("bankDetails", {
                  ...form.bankDetails,
                  isVerified: v,
                })
              }
            />
          </Section>

          {error && (
            <div className="text-sm font-medium text-red-500">{error}</div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-dark-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
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
    <div>
      <h4 className="mb-3 text-base font-semibold text-dark dark:text-white">
        {title}
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-dark-2"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div className="sm:col-span-2">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-dark-2"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-dark-2"
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
