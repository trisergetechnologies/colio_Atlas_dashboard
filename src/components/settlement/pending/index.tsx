"use client";

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
import { GeneratePendingSettlementsModal } from "./GeneratePendingSettlementsModal";
import { SettlementActionModal } from "./SettlementActionModal";

export function PendingSettlementTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/getsettlements`,
        {
          params: { status: "pending", page, limit },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data?.success) throw new Error();

      setData(res.data.data || []);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch {
      setError("Failed to load pending settlements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, [page]);

  if (loading) return <div className="p-6 text-sm text-dark-4">Loading...</div>;
  if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Pending Settlements
        </h2>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Generate Pending Settlements
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Wallet (Pending)</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Empty state */}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold text-dark dark:text-white">
                    No pending settlements
                  </span>
                  <span className="text-sm text-dark-4 dark:text-dark-6">
                    All consultant wallets are currently clear.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {data.map((s) => (
            <TableRow key={s._id}>
              {/* Consultant */}
              <TableCell className="flex items-center gap-3 font-medium text-dark dark:text-white">
                <Image
                  src={s.consultant?.avatar || "/images/avatars/women.png"}
                  width={36}
                  height={36}
                  alt=""
                  className="rounded-full"
                />
                {s.consultant?.name}
              </TableCell>

              {/* Email */}
              <TableCell className="text-dark-4 dark:text-dark-6">
                {s.consultant?.email}
              </TableCell>

              {/* Amount */}
              <TableCell className="font-semibold text-green-600 dark:text-green-400">
                ₹{s.amount}
              </TableCell>

              {/* Wallet pending */}
              <TableCell className="font-medium text-amber-600 dark:text-amber-400">
                ₹{s.consultant?.consultantProfile?.wallet?.pending || 0}
              </TableCell>

              {/* Date */}
              <TableCell className="text-sm text-dark-4 dark:text-dark-6">
                {new Date(s.createdAt).toLocaleDateString()}
              </TableCell>

              {/* Status */}
              <TableCell>
                <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                  Pending
                </span>
              </TableCell>

              {/* Action */}
              <TableCell className="text-right">
                <button
                  onClick={() => {
                    setSelectedSettlement(s);
                    setIsActionModalOpen(true);
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Review
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}

      <GeneratePendingSettlementsModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={fetchSettlements}
      />

      <SettlementActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        settlement={selectedSettlement}
        onUpdated={fetchSettlements}
      />
    </div>
  );
}

function Pagination({ page, setPage, totalPages }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-4 text-sm">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="font-medium disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-dark-4 dark:text-dark-6">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="font-medium disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
