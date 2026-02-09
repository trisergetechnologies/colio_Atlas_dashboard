"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SessionDetailsModal({
  isOpen,
  onClose,
  session,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !session) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[10px] bg-white dark:bg-gray-dark">
        <div className="flex justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Session Details</h3>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <Section title="Timeline">
            <Info label="Created" value={session.timeline.createdAt} />
            <Info label="Started" value={session.timeline.startedAt} />
            <Info label="Ended" value={session.timeline.endedAt} />
          </Section>

          <Section title="Billing">
            <Info label="Rate / min" value={`₹${session.billing.ratePerMinute}`} />
            <Info label="Minutes Billed" value={session.billing.billedMinutes} />
            <Info label="Bonus Used" value={`₹${session.billing.bonusUsed}`} />
            <Info
              label="Total Amount"
              value={`₹${session.billing.billedAmount}`}
            />
          </Section>

          <Section title="Earnings Split">
            <Info
              label="Consultant"
              value={`₹${session.earnings.consultantEarning}`}
            />
            <Info
              label="Platform"
              value={`₹${session.earnings.systemEarning}`}
            />
          </Section>

          <Section title="Termination">
            <Info
              label="Ended By"
              value={session.termination.endedBy?.name || "System"}
            />
            <Info label="Reason" value={session.termination.reason || "-"} />
            <Info label="Auto Ended" value={session.termination.autoEnded ? "Yes" : "No"} />
          </Section>

          <Section title="Quality">
            <Info label="Network" value={session.quality.network} />
          </Section>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-base font-semibold">{title}</h4>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="text-sm">
      <span className="block text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
