"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    source: "",
    sessionId: "",
    from: "",
    to: ""
  });

  const fetchData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/system-wallet`
      const token = await getToken();
      setLoading(true);
      const res = await axios.get(url, {
        params: filters,
        headers: {Authorization: `Bearer ${token}`}
      });

      setWallet(res.data.data.wallet);
      setLogs(res.data.data.logs.items);
      setPagination(res.data.data.logs);
    } catch (err) {
      console.error("System wallet fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.page]);

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <Breadcrumb pageName="System Wallet" />

      {/* ================= WALLET BALANCE ================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-primary to-indigo-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">System Wallet Balance</p>
          <h2 className="mt-2 text-3xl font-bold">
            ₹{wallet?.balance?.toLocaleString() || 0}
          </h2>
          <p className="mt-1 text-xs opacity-70">
            Last updated:{" "}
            {wallet?.updatedAt
              ? new Date(wallet.updatedAt).toLocaleString()
              : "--"}
          </p>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="mb-5 rounded-lg bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <input
            placeholder="Session ID"
            className="form-input"
            value={filters.sessionId}
            onChange={(e) =>
              setFilters({ ...filters, sessionId: e.target.value })
            }
          />

          <select
            className="form-input"
            value={filters.source}
            onChange={(e) =>
              setFilters({ ...filters, source: e.target.value })
            }
          >
            <option value="">All Sources</option>
            <option value="call_billing">Call Billing</option>
          </select>

          <input
            type="date"
            className="form-input"
            onChange={(e) =>
              setFilters({ ...filters, from: e.target.value })
            }
          />

          <input
            type="date"
            className="form-input"
            onChange={(e) =>
              setFilters({ ...filters, to: e.target.value })
            }
          />

          <button
            onClick={() => {
              setFilters({ ...filters, page: 1 });
              fetchData();
            }}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ================= LOGS TABLE ================= */}
      <div className="overflow-hidden rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <table className="w-full table-auto">
          <thead className="border-b border-stroke dark:border-dark-3">
            <tr className="text-left">
              <th className="px-4 py-3">Session</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-stroke dark:border-dark-3"
                >
                  <td className="px-4 py-3 text-sm">
                    {log.sessionId}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.source}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    +₹{log.amount}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="flex items-center justify-between p-4">
          <p className="text-sm">
            Page {pagination.page} of{" "}
            {Math.ceil((pagination.total || 0) / pagination.limit)}
          </p>

          <div className="flex gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() =>
                setFilters({ ...filters, page: filters.page - 1 })
              }
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={
                filters.page >=
                Math.ceil((pagination.total || 0) / pagination.limit)
              }
              onClick={() =>
                setFilters({ ...filters, page: filters.page + 1 })
              }
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
