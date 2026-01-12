import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PendingSettlementTable } from "@/components/settlement/pending";
import { SettlementSkeleton } from "@/components/settlement/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settlement | Pending",
};

const SettlementPendingTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Settlement / Pending" />

      <div className="space-y-10">
        <Suspense fallback={<SettlementSkeleton />}>
          <PendingSettlementTable />
        </Suspense>
      </div>
    </>
  );
};

export default SettlementPendingTablesPage;
