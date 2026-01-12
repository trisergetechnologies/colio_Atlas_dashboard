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
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    languages: [],
    bio: "",
    onboardingScore: "",
    ratePerMinute: "",
    ratePerMinuteVideo: "",
    ratePerMinuteChat: "",
    availabilityStatus: "offWork",
    isActive: true,
    isVerified: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const submit = async () => {
    try {
      setError(null);

      if (form.password !== form.confirmPassword) {
        setError("Password and confirm password do not match");
        return;
      }

      setLoading(true);
      const token = await getToken();

      const payload = {
        ...form,
        onboardingScore: form.onboardingScore
          ? Number(form.onboardingScore)
          : undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        languages: form.languages.length ? form.languages : undefined
      };

      delete payload.confirmPassword;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/onboard-consultant`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
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
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-semibold">Onboard Consultant</h3>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 grid gap-4 sm:grid-cols-2">
          <Input label="Name" onChange={(v: any) => setForm({ ...form, name: v })} />
          <Input label="Email" onChange={(v: any) => setForm({ ...form, email: v })} />
          <Input label="Phone" onChange={(v: any) => setForm({ ...form, phone: v })} />

          {/* Password */}
          <PasswordInput
            label="Password"
            value={form.password}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            onChange={(v: any) => setForm({ ...form, password: v })}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm Password"
            value={form.confirmPassword}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            onChange={(v: any) => setForm({ ...form, confirmPassword: v })}
          />

          <Select
            label="Gender"
            options={["male", "female", "other"]}
            onChange={(v: any) => setForm({ ...form, gender: v })}
          />

          <Input
            label="Date of Birth"
            type="date"
            onChange={(v: any) => setForm({ ...form, dateOfBirth: v })}
          />

          <Input
            label="Onboarding Score (0–100)"
            onChange={(v: any) => setForm({ ...form, onboardingScore: v })}
          />

          <Input
            label="Voice Rate / min"
            onChange={(v: any) => setForm({ ...form, ratePerMinute: v })}
          />
          <Input
            label="Video Rate / min"
            onChange={(v: any) => setForm({ ...form, ratePerMinuteVideo: v })}
          />
          <Input
            label="Chat Rate / min"
            onChange={(v: any) => setForm({ ...form, ratePerMinuteChat: v })}
          />

          <Select
            label="Availability Status"
            options={["offWork", "onWork", "busy"]}
            onChange={(v: any) => setForm({ ...form, availabilityStatus: v })}
          />

          {/* Bio */}
          <Textarea
            label="Bio"
            onChange={(v: any) => setForm({ ...form, bio: v })}
          />
        </div>

        {error && (
          <p className="px-6 pb-2 text-sm text-red-500">{error}</p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4 dark:border-dark-3">
          <button onClick={onClose} className="text-sm font-medium">
            Cancel
          </button>
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

/* ================== Helpers ================== */

function Input({ label, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none dark:border-dark-3 dark:bg-transparent"
      />
    </div>
  );
}

function Textarea({ label, onChange }: any) {
  return (
    <div className="sm:col-span-2">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <textarea
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none resize-none dark:border-dark-3 dark:bg-transparent"
      />
    </div>
  );
}

function Select({ label, options, onChange }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none dark:border-dark-3 dark:bg-transparent"
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function PasswordInput({ label, value, show, toggle, onChange }: any) {
  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none dark:border-dark-3 dark:bg-transparent"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-9 text-xs opacity-70"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
