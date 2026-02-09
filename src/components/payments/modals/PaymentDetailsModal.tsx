"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function PaymentDetailsModal({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

useEffect(() => {
  document.body.style.overflow = isOpen ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);

  if (!mounted || !isOpen || !transaction) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[10px] bg-white dark:bg-gray-dark">
        {/* Header */}
        <div className="flex justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Transaction Details</h3>
          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <Section title="Transaction">
            <Info label="Order ID" value={transaction.orderId} />
            <Info label="Status" value={transaction.status} />
            <Info label="Gateway" value={transaction.gateway.provider} />
          </Section>

          <Section title="Amounts">
            <Info label="Gross Amount" value={`₹${transaction.amounts.gross}`} />
            <Info
              label="Wallet Credit"
              value={`₹${transaction.amounts.walletCredit}`}
            />
            <Info
              label="Platform Fee"
              value={`₹${transaction.amounts.platformFee}`}
            />
            <Info
              label="Net Credited"
              value={`₹${transaction.amounts.netCredited}`}
            />
          </Section>

          <Section title="Razorpay">
            <Info
              label="Order ID"
              value={transaction.gateway.razorpayOrderId || "-"}
            />
            <Info
              label="Payment ID"
              value={transaction.gateway.razorpayPaymentId || "-"}
            />
            <Info
              label="Signature"
              value={
                transaction.gateway.signaturePresent ? "Present" : "Missing"
              }
            />
          </Section>

          <Section title="Timeline">
            <Info label="Created" value={transaction.timeline.createdAt} />
            <Info label="Credited" value={transaction.timeline.creditedAt || "-"} />
            <Info label="Updated" value={transaction.timeline.updatedAt} />
          </Section>

          <Section title="Billing Info">
            <Info label="Name" value={transaction.billingInfo.name || "-"} />
            <Info label="Email" value={transaction.billingInfo.email || "-"} />
            <Info label="Phone" value={transaction.billingInfo.phone || "-"} />
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
