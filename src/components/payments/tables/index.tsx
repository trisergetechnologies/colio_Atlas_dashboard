"use client";

import { PaymentDetailsModal } from "@/components/payments/modals/PaymentDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getToken } from "@/utils/tokenHelper";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export function PaymentsTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState("");
  const [gateway, setGateway] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/gettransactionshistory`,
          {
            params: { page, limit, status, gateway },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data?.success) {
          throw new Error("Failed to fetch transactions");
        }

        setData(res.data.data.items || []);
        setTotal(res.data.data.pagination.total || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit, status, gateway]);

  const totalPages = Math.ceil(total / limit);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Transaction History
        </h2>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="CAPTURED">Captured</option>
            <option value="FAILED">Failed</option>
            <option value="AUTHORIZED">Authorized</option>
            <option value="CREATED">Created</option>
          </select>

          <select
            value={gateway}
            onChange={(e) => {
              setPage(1);
              setGateway(e.target.value);
            }}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All Gateways</option>
            <option value="razorpay">Razorpay</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-t [&>th]:py-3">
            <TableHead>User</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">More</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((t) => (
            <TableRow key={t.transactionId}>
              <TableCell className="flex items-center gap-2">
                <Image
                  src={t.user.avatar || "/images/avatar/default.png"}
                  width={36}
                  height={36}
                  className="rounded-full"
                  alt="user"
                />
                <div>
                  <div className="font-medium">{t.user.name}</div>
                  <div className="text-xs text-gray-500">
                    {t.user.email}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-xs">{t.orderId}</TableCell>

              <TableCell className="uppercase text-xs font-medium text-primary">
                {t.gateway.provider}
              </TableCell>

              <TableCell className="font-medium">
                ₹{t.amounts.gross}
              </TableCell>

              <TableCell>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    t.status === "CAPTURED"
                      ? "bg-green-100 text-green-700"
                      : t.status === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.status}
                </span>
              </TableCell>

              <TableCell className="text-sm">
                {t.timeline.createdAt}
              </TableCell>

              <TableCell className="text-right">
                <button
                  onClick={() => {
                    setSelectedTx(t);
                    setIsModalOpen(true);
                  }}
                  className="font-medium text-primary"
                >
                  →
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <PaymentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
