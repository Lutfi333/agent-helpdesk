import { Suspense } from "react";
import CustomerDetailContent from "./_components/customer-detail-content";

export default function DashboardPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerDetailContent id={params.id} />
    </Suspense>
  );
}
