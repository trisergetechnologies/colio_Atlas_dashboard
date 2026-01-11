"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login-admin`;

    try {
      const res = await axios.post(url, {
        email,
        password,
      });

      if (!res.data.success) {
        setError(res.data.message || "Login failed");
        return;
      }

      const {
        accessToken,
        adminId,
        name,
        email: maskedEmail,
        role,
        avatar,
      } = res.data.data;

      login(accessToken, {
        adminId,
        name,
        email: maskedEmail,
        role,
        avatar,
      });

      router.push("/atlas");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617]" />

      {/* Decorative Glows */}
      <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/30 blur-[140px]" />
      <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-purple-500/30 blur-[140px]" />

      {/* Modal */}
      <div className="relative w-full max-w-[380px] rounded-2xl bg-white/90 shadow-2xl backdrop-blur-xl dark:bg-dark/90">
        {/* Header */}
        <div className="border-b border-stroke px-6 py-5 dark:border-dark-3">
          <h2 className="text-center text-2xl font-semibold text-dark dark:text-white">
            Colio Atlas Sign In
          </h2>
          <p className="text-body-color mt-1 text-center text-sm">
            Access your dashboard securely
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
