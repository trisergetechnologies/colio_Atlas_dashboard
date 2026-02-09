import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PaymentsTable } from "@/components/payments/tables";
import { PaymentsSkeleton } from "@/components/payments/tables/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Payments",
};

const ExpertsTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Payments" />

      <div className="space-y-10">
        <Suspense fallback={<PaymentsSkeleton />}>
          <PaymentsTable/>
        </Suspense>
      </div>
    </>
  );
};

export default ExpertsTablesPage;
