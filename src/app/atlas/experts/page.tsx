import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ExpertsTable } from "@/components/experts/tables";
import { ExpertsSkeleton } from "@/components/experts/tables/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Experts",
};

const ExpertsTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Experts" />

      <div className="space-y-10">
        <Suspense fallback={<ExpertsSkeleton />}>
          <ExpertsTable />
        </Suspense>
      </div>
    </>
  );
};

export default ExpertsTablesPage;
