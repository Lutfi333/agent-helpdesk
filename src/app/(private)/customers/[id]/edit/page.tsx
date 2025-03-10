import { Suspense } from "react";
import CustomerEditContent from "./_components/customer-edit-content";

export default function DashboardPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerEditContent id={params.id} />
    </Suspense>
  );
}
