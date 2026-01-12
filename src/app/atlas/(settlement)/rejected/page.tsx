import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { RejectedSettlementTable } from "@/components/settlement/rejected";
import { SettlementSkeleton } from "@/components/settlement/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settlement | Rejected",
};

const SettlementRejectedTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Settlement / Rejected" />

      <div className="space-y-10">
        <Suspense fallback={<SettlementSkeleton />}>
          <RejectedSettlementTable />
        </Suspense>
      </div>
    </>
  );
};

export default SettlementRejectedTablesPage;
