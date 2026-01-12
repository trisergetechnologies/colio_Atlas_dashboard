"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/user/password`
      const token = await getToken();

      const res = await axios.put(url, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }, {headers: {Authorization: `Bearer ${token}`}});

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setMessage("Password updated successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (err: any) {
      setError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <Breadcrumb pageName="Change Password" />

      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="mb-6 text-xl font-semibold text-dark dark:text-white">
          Update Your Password
        </h2>

        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-dark-3"
            />
          </div>

          {/* Feedback */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-900/20">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600 dark:bg-green-900/20">
              {message}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
