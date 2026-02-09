"use client";

import { SessionDetailsModal } from "@/components/sessions/modals/SessionDetailsModal";
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

export function SessionsTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/getsessiondetails`,
          {
            params: { page, limit },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data?.success) {
          throw new Error("Failed to fetch sessions");
        }

        setData(res.data.data.items || []);
        setTotal(res.data.data.pagination.total || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Sessions
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:py-3">
            <TableHead>Customer</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">More</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((s) => (
            <TableRow key={s.sessionId}>
              <TableCell className="flex items-center gap-2">
                <Image
                  src={
                    s.participants.customer.avatar ||
                    "/images/avatar/default.png"
                  }
                  width={36}
                  height={36}
                  className="rounded-full"
                  alt="customer"
                />
                {s.participants.customer.name}
              </TableCell>

              <TableCell>{s.participants.consultant.name}</TableCell>

              <TableCell className="capitalize">
                {s.type == "voice" ? (
                  <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                    {s.type}
                  </span>
                ) : (
                  <span className="rounded bg-primary/10 px-2 py-1 text-xs text-red-500">
                    {s.type}
                  </span>
                )}
              </TableCell>

              <TableCell>{s.duration.minutes} min</TableCell>

              <TableCell>₹{s.billing.billedAmount || 0}</TableCell>

              <TableCell>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    s.status === "ended"
                      ? "bg-green-100 text-green-700"
                      : s.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {s.status}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <button
                  onClick={() => {
                    setSelectedSession(s);
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

      <SessionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={selectedSession}
      />
    </div>
  );
}
