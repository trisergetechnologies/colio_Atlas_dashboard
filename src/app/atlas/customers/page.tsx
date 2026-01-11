import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomersTable } from "@/components/customers/tables";
import { CustomersSkeleton } from "@/components/customers/tables/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customers",
};

const CustomersTablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Customers" />

      <div className="space-y-10">
        <Suspense fallback={<CustomersSkeleton />}>
          <CustomersTable />
        </Suspense>
      </div>
    </>
  );
};

export default CustomersTablesPage;
