import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SessionsTable } from "@/components/sessions/tables";
import { SessionsSkeleton } from "@/components/sessions/tables/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Session",
};

const ExpertsTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sessions" />

      <div className="space-y-10">
        <Suspense fallback={<SessionsSkeleton />}>
          <SessionsTable/>
        </Suspense>
      </div>
    </>
  );
};

export default ExpertsTablesPage;
