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
import { useEffect, useRef, useState } from "react";
import { ApproveExpertModal } from "../modals/ApproveExpertModal";
import { OnboardConsultantModal } from "../modals/OnboardConsultantModal";
import { UpdateExpertModal } from "../modals/UpdateExpertModal";
import { Camera } from "lucide-react";

function ExpertAvatar({ expert }: { expert: any }) {
  const [failed, setFailed] = useState(false);
  const attempted = useRef(false);

  const rawUrl = expert?.avatar
    || expert?.documents?.find((d: any) => d?.type === "profile_photo")?.url;
  const resolved = rawUrl ? resolveImageUrl(rawUrl) : null;

  const initials = (expert?.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() || "")
    .join("");

  if (!resolved || failed) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-primary/10 text-sm font-bold text-primary">
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      className="h-11 w-11 rounded-full border border-stroke object-cover"
      alt={`${expert.name} avatar`}
      onError={() => {
        if (!attempted.current) {
          attempted.current = true;
          setFailed(true);
        }
      }}
    />
  );
}

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
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Experts
        </h2>

        <button
          onClick={() => setIsOnboardOpen(true)}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
        >
          + Onboard Consultant
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-stroke px-6 pb-4 dark:border-dark-3 sm:px-7 xl:px-8.5">
        {filterTabs.map((t) => (
          <button
            key={t.id || "all"}
            type="button"
            onClick={() => {
              setPage(1);
              setApplicationFilter(t.id);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              applicationFilter === t.id
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-3 dark:text-gray-300 dark:hover:bg-dark-2"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t [&>th]:h-auto [&>th]:py-3 [&>th]:whitespace-nowrap">
            <TableHead className="min-w-[200px] pl-5 sm:pl-6 xl:pl-7.5">
              Name
            </TableHead>
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="min-w-[120px]">Application</TableHead>
            <TableHead className="min-w-[110px]">Status</TableHead>
            <TableHead className="min-w-[80px] text-right">Voice</TableHead>
            <TableHead className="min-w-[80px] text-right">Video</TableHead>
            <TableHead className="min-w-[70px] text-right">Rating</TableHead>
            <TableHead className="min-w-[140px] pr-5 text-right sm:pr-6 xl:pr-7.5">
              Actions
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
                <div className="flex items-center gap-3">
                  <ExpertAvatar expert={expert} />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{expert.name}</div>
                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {expert.email}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="truncate" title={expert.consultantProfile?.category}>
                  {expert.consultantProfile?.category ?? "—"}
                </span>
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    (expert.consultantProfile?.applicationStatus ?? "approved") ===
                    "pending_approval"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
                      : (expert.consultantProfile?.applicationStatus ?? "approved") ===
                          "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        : (expert.consultantProfile?.applicationStatus ?? "approved") ===
                            "pending_profile"
                          ? "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"
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
                <div className="flex flex-col items-start gap-1.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      expert.isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400"
                    }`}
                  >
                    {expert.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    disabled={statusToggleId === expert._id}
                    onClick={() => handleToggleActive(expert)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      expert.isActive
                        ? "border border-stroke text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
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

              <TableCell className="text-right">
                ₹{expert.consultantProfile?.ratePerMinute ?? "—"}
              </TableCell>

              <TableCell className="text-right">
                ₹{expert.consultantProfile?.ratePerMinuteVideo ?? "—"}
              </TableCell>

              <TableCell className="text-right">
                {expert.consultantProfile?.ratingAverage?.toFixed(1) || "0.0"}
              </TableCell>

              <TableCell className="pr-5 sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-1.5">
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
                  {expert.consultantProfile?.applicationStatus === "pending_approval" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForApprove(expert);
                        setIsApproveOpen(true);
                      }}
                      className="rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                      title="Review application"
                    >
                      Review
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`avatar-${expert._id}`)?.click()
                    }
                    className="inline-flex items-center justify-center rounded-md border border-stroke p-1.5 text-gray-500 hover:bg-gray-100 hover:text-dark dark:border-dark-3 dark:text-gray-400 dark:hover:bg-dark-3 dark:hover:text-white"
                    title="Upload avatar"
                  >
                    <Camera size={15} />
                  </button>
                  {avatarFiles[expert._id] && (
                    <button
                      type="button"
                      disabled={avatarUploadingId === expert._id}
                      onClick={() => handleAvatarUpload(expert._id)}
                      className="rounded-md bg-primary px-2 py-1.5 text-xs text-white disabled:opacity-50"
                    >
                      {avatarUploadingId === expert._id ? "…" : "Set"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedExpertForEdit(expert);
                      setIsEditModalOpen(true);
                    }}
                    title="Edit Expert"
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-500 hover:bg-primary/10 hover:text-primary dark:text-gray-400"
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
                  <button
                    onClick={() => {
                      setSelectedUser(expert);
                      setIsModalOpen(true);
                    }}
                    title="View details"
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-dark dark:text-gray-400 dark:hover:bg-dark-3 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-dark-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-stroke px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40 dark:border-dark-3 dark:hover:bg-dark-3"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-stroke px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40 dark:border-dark-3 dark:hover:bg-dark-3"
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
