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
import { OnboardConsultantModal } from "../modals/OnboardConsultantModal";
import { UpdateExpertModal } from "../modals/UpdateExpertModal";
import { Camera } from "lucide-react";

export function ExpertsTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [avatarFiles, setAvatarFiles] = useState<Record<string, File>>({});
  const [avatarUploadingId, setAvatarUploadingId] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpertForEdit, setSelectedExpertForEdit] = useState<
    any | null
  >(null);

  const [isOnboardOpen, setIsOnboardOpen] = useState(false);

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

      const fetchExperts = async () => {
        try {
          setLoading(true);
          setError(null);
          const token = await getToken();

          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/getusersforadmin`,
            {
              params: {
                role: "consultant",
                page,
                limit,
              },
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!res.data?.success) {
            throw new Error(res.data?.message || "Failed to fetch experts");
          }

          setData(res.data.data.items || []);
          setTotal(res.data.data.total || 0);
        } catch (err: any) {
          console.error("Experts fetch error:", err);
          setError("Failed to load experts");
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {
    fetchExperts();
  }, [page, limit]);

  const handleAvatarUpload = async (consultantId: string) => {
    const file = avatarFiles[consultantId];
    if (!file) return;

    try {
      setAvatarUploadingId(consultantId);

      const token = await getToken();
      const formData = new FormData();

      formData.append("consultantId", consultantId);
      formData.append("avatar", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/consultants/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Avatar upload failed");
      }

      // 🔁 Update avatar instantly in table
      setData((prev) =>
        prev.map((u) =>
          u._id === consultantId ? { ...u, avatar: res.data.data.avatar } : u,
        ),
      );

      // cleanup
      setAvatarFiles((prev) => {
        const copy = { ...prev };
        delete copy[consultantId];
        return copy;
      });
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar");
    } finally {
      setAvatarUploadingId(null);
    }
  };


  const totalPages = Math.ceil(total / limit);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Experts
        </h2>

        <button
          onClick={() => setIsOnboardOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Onboard Consultant
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>{"Voice (per min)"}</TableHead>
            <TableHead>{"Video (per min)"}</TableHead>
            <TableHead>Upload Avatar</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Average Rating
            </TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Edit
            </TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((expert) => (
            <TableRow
              key={expert._id}
              className="text-base font-medium text-dark dark:text-white"
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <Image
                  src={expert.avatar || "/images/avatar/default.png"}
                  className="aspect-[6/5] w-15 rounded-[5px] object-cover"
                  width={60}
                  height={50}
                  alt="Expert avatar"
                  role="presentation"
                />
                <div>{expert.name}</div>
              </TableCell>

              <TableCell>{expert.email}</TableCell>

              <TableCell>
                ₹{expert.consultantProfile?.ratePerMinute ?? "-"}
              </TableCell>

              <TableCell>
                ₹{expert.consultantProfile?.ratePerMinuteVideo ?? "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {/* Hidden file input */}
                  <input
                    id={`avatar-${expert._id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAvatarFiles((prev) => ({
                          ...prev,
                          [expert._id]: e.target.files![0],
                        }));
                      }
                    }}
                  />

                  {/* Camera icon */}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`avatar-${expert._id}`)?.click()
                    }
                    className="inline-flex items-center justify-center rounded-md border border-stroke bg-white p-2 text-dark shadow-sm hover:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                    title="Choose avatar"
                  >
                    <Camera size={20} />
                  </button>

                  {/* Set button */}
                  <button
                    type="button"
                    disabled={
                      !avatarFiles[expert._id] ||
                      avatarUploadingId === expert._id
                    }
                    onClick={() => handleAvatarUpload(expert._id)}
                    className="rounded-md bg-primary px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {avatarUploadingId === expert._id ? "Uploading..." : "Set"}
                  </button>
                </div>
              </TableCell>

              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                {expert.consultantProfile?.ratingAverage?.toFixed(1) || "0.0"}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <button
                  onClick={() => {
                    setSelectedExpertForEdit(expert);
                    setIsEditModalOpen(true);
                  }}
                  title="Edit Expert"
                  className="inline-flex items-center justify-center rounded-md p-2 text-primary transition hover:bg-primary/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.39.243l-4 1.333a1 1 0 01-1.264-1.264l1.333-4a1 1 0 01.243-.39l9.9-9.9a2 2 0 012.828 0zM15 4l-9.193 9.193-.47 1.41 1.41-.47L16 5l-1-1z" />
                  </svg>
                </button>
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <button
                  onClick={() => {
                    setSelectedUser(expert);
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

      {/* 🔹 Pagination controls (logic only, no theme change) */}
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

      <OnboardConsultantModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        onSuccess={() => fetchExperts()}
      />

      <UpdateExpertModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpertForEdit(null);
        }}
        expert={selectedExpertForEdit}
        onUpdated={() => {
          fetchExperts();
        }}
      />

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
