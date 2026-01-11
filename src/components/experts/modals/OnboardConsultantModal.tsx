"use client";

import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OnboardConsultantModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    languages: [],
    bio: "",
    skills: [],
    ratePerMinute: "",
    ratePerMinuteVideo: "",
    ratePerMinuteChat: "",
    availabilityStatus: "offWork",
    isActive: true,
    isVerified: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/onboard-consultant`,
        {
          ...form,
          languages: form.languages.length ? form.languages : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Onboarding failed");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to onboard consultant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Onboard Consultant</h3>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 grid gap-4 sm:grid-cols-2">
          <Input label="Name" onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Email" onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Phone" onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="Password" type="password" onChange={(v) => setForm({ ...form, password: v })} />

          <Input label="Voice Rate / min" onChange={(v) => setForm({ ...form, ratePerMinute: v })} />
          <Input label="Video Rate / min" onChange={(v) => setForm({ ...form, ratePerMinuteVideo: v })} />
          <Input label="Chat Rate / min" onChange={(v) => setForm({ ...form, ratePerMinuteChat: v })} />

          <Input label="Bio" full onChange={(v) => setForm({ ...form, bio: v })} />
          {/* <Input label="Skills (comma separated)" full onChange={(v) => setForm({ ...form, skills: v.split(",") })} /> */}
        </div>

        {error && <p className="px-6 text-sm text-red-500">{error}</p>}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose} className="text-sm font-medium">Cancel</button>
          <button
            disabled={loading}
            onClick={submit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Consultant"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small helpers ---------- */

function Input({
  label,
  onChange,
  type = "text",
  full = false,
}: {
  label: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}
