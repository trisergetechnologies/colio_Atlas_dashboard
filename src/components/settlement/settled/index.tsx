"use client";

import { UserDetailsModal } from "@/components/modals/UserDetailsModal";
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

export function SettledSettlementTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/getsettlements`,
          {
            params: { status: "settled", page, limit },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data?.success) throw new Error();

        setData(res.data.data || []);
        setTotalPages(res.data.pagination.totalPages || 1);
      } catch {
        setError("Failed to load settled settlements");
      } finally {
        setLoading(false);
      }
    };

    fetchSettlements();
  }, [page]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold">Settled Settlements</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>UTR</TableHead>
            <TableHead>Approved By</TableHead>
            <TableHead>Approved At</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7} // ⚠️ adjust to number of columns in that table
                className="py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <span className="text-lg font-semibold text-dark dark:text-white">
                    No settlements found
                  </span>
                  <span className="text-sm text-dark-4 dark:text-dark-6">
                    There are currently no records available for this status.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}


          {data.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.consultant?.name}</TableCell>
              <TableCell>₹{s.amount}</TableCell>
              <TableCell>{s.utr || "-"}</TableCell>
              <TableCell>{s.approvedBy?.name || "Admin"}</TableCell>
              <TableCell>
                {s.approvedAt ? `${new Date(s.approvedAt).toLocaleDateString()} | ${new Date(s.approvedAt).toLocaleTimeString()}` : "-"}
              </TableCell>
              <TableCell className="capitalize">{s.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}


function Pagination({ page, setPage, totalPages }: any) {
  return (
    <div className="flex justify-between px-6 py-4">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}