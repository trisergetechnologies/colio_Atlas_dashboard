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

export function CustomersTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/getusersforadmin`,
          {
            params: {
              role: "customer",
              page,
              limit,
            },
            headers: {Authorization: `Bearer ${token}`}
          }
        );

        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to fetch customers");
        }

        setData(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
      } catch (err: any) {
        console.error("Customer fetch error:", err);
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Customers
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Referral Code</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Status
            </TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              More
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user) => (
            <TableRow
              key={user._id}
              className="text-base font-medium text-dark dark:text-white"
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <Image
                  src={user.avatar || "/images/avatars/man.jpg"}
                  className="aspect-[6/5] w-15 rounded-[5px] object-cover"
                  width={60}
                  height={50}
                  alt="Customer avatar"
                />
                <div>{user.name}</div>
              </TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>
                ₹{(user.wallet?.main || 0) + (user.wallet?.bonus || 0)}
              </TableCell>

              <TableCell>{user.referralCode || "-"}</TableCell>

              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                {user.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <button
                  onClick={() => {
                    setSelectedUser(user);
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

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

      {/* 🔹 Pagination controls (NO UI BREAK) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
