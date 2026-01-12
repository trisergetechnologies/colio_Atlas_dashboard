import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SettledSettlementTable } from "@/components/settlement/settled";
import { SettlementSkeleton } from "@/components/settlement/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settlement | Rejected",
};

const SettlementSettledTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Settlement / Settled" />

      <div className="space-y-10">
        <Suspense fallback={<SettlementSkeleton />}>
          <SettledSettlementTable/>
        </Suspense>
      </div>
    </>
  );
};

export default SettlementSettledTablesPage;
