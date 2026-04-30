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
import { getDefaultAvatarUrl, resolveImageUrl } from "@/utils/imageUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import { ApproveExpertModal } from "../modals/ApproveExpertModal";
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

  const [statusToggleId, setStatusToggleId] = useState<string | null>(null);

  const [applicationFilter, setApplicationFilter] = useState<string>("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [selectedForApprove, setSelectedForApprove] = useState<any | null>(null);

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
                ...(applicationFilter
                  ? { applicationStatus: applicationFilter }
                  : {}),
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
  }, [page, limit, applicationFilter]);

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

  const handleToggleActive = async (expert: any) => {
    const id = expert._id;
    const next = !expert.isActive;
    try {
      setStatusToggleId(id);
      const token = await getToken();
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/updateconsultant/${id}`,
        { isActive: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Update failed");
      }
      setData((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: next } : u)),
      );
    } catch (err: any) {
      console.error("Toggle active error:", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update expert status",
      );
    } finally {
      setStatusToggleId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const getAvatarSrc = (expert: any) => {
    const avatar = expert?.avatar;
    if (avatar && String(avatar).trim().length > 0) {
      return resolveImageUrl(avatar);
    }
    const profileDoc = expert?.documents?.find((d: any) => d?.type === "profile_photo")?.url;
    if (profileDoc) return resolveImageUrl(profileDoc);
    return getDefaultAvatarUrl();
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const filterTabs: { id: string; label: string }[] = [
    { id: "", label: "All" },
    { id: "pending_approval", label: "Pending review" },
    { id: "pending_profile", label: "Incomplete" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-col gap-3 px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="flex flex-wrap gap-2 border-b border-stroke px-6 pb-3 dark:border-dark-3 sm:px-7 xl:px-8.5">
        {filterTabs.map((t) => (
          <button
            key={t.id || "all"}
            type="button"
            onClick={() => {
              setPage(1);
              setApplicationFilter(t.id);
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              applicationFilter === t.id
                ? "bg-primary text-white"
                : "bg-gray-200 text-dark dark:bg-dark-3 dark:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t [&>th]:h-auto [&>th]:py-3">
            <TableHead className="min-w-[180px] pl-5 sm:pl-6 xl:pl-7.5">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Application</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{"Voice (per min)"}</TableHead>
            <TableHead>{"Video (per min)"}</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Rating
            </TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Review
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
              className="text-sm font-medium text-dark dark:text-white"
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                <div className="flex min-w-fit items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAvatarSrc(expert)}
                  className="h-11 w-11 rounded-full border border-stroke object-cover"
                  alt={`${expert.name} avatar`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    (e.currentTarget as HTMLImageElement).src = getDefaultAvatarUrl();
                  }}
                />
                <div>{expert.name}</div>
                </div>
              </TableCell>

              <TableCell className="max-w-[220px] truncate" title={expert.email}>
                {expert.email}
              </TableCell>

              <TableCell className="max-w-[140px] truncate" title={expert.consultantProfile?.category}>
                {expert.consultantProfile?.category ?? "—"}
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex max-w-[130px] truncate rounded-full px-2 py-0.5 text-xs font-semibold ${
                    (expert.consultantProfile?.applicationStatus ?? "approved") ===
                    "pending_approval"
                      ? "bg-amber-500/20 text-amber-800"
                      : (expert.consultantProfile?.applicationStatus ?? "approved") ===
                          "rejected"
                        ? "bg-red-500/15 text-red-700"
                        : (expert.consultantProfile?.applicationStatus ?? "approved") ===
                            "pending_profile"
                          ? "bg-sky-500/15 text-sky-800"
                          : "bg-emerald-500/15 text-emerald-800"
                  }`}
                  title={expert.consultantProfile?.applicationStatus ?? "approved"}
                >
                  {(expert.consultantProfile?.applicationStatus ?? "approved").replace(
                    /_/g,
                    " ",
                  )}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${
                      expert.isActive
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {expert.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    disabled={statusToggleId === expert._id}
                    onClick={() => handleToggleActive(expert)}
                    className={`w-fit rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      expert.isActive
                        ? "border border-stroke bg-white text-dark hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                        : "bg-primary text-white hover:bg-primary/90"
                    } disabled:opacity-50`}
                  >
                    {statusToggleId === expert._id
                      ? "…"
                      : expert.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </div>
              </TableCell>

              <TableCell>
                ₹{expert.consultantProfile?.ratePerMinute ?? "-"}
              </TableCell>

              <TableCell>
                ₹{expert.consultantProfile?.ratePerMinuteVideo ?? "-"}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                {expert.consultantProfile?.ratingAverage?.toFixed(1) || "0.0"}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                {expert.consultantProfile?.applicationStatus === "pending_approval" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedForApprove(expert);
                      setIsApproveOpen(true);
                    }}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Review
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-2">
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
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`avatar-${expert._id}`)?.click()
                    }
                    className="inline-flex items-center justify-center rounded-md border border-stroke bg-white p-2 text-dark shadow-sm hover:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                    title="Choose profile photo"
                  >
                    <Camera size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={
                      !avatarFiles[expert._id] ||
                      avatarUploadingId === expert._id
                    }
                    onClick={() => handleAvatarUpload(expert._id)}
                    className="rounded-md bg-primary px-2.5 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {avatarUploadingId === expert._id ? "..." : "Set"}
                  </button>
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
                </div>
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

      <ApproveExpertModal
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
          setSelectedForApprove(null);
        }}
        expert={selectedForApprove}
        onDone={() => fetchExperts()}
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
