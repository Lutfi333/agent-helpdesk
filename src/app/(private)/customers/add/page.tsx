import { Suspense } from "react";
import CustomerAddContent from "./_components/customer-add-content";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerAddContent />
    </Suspense>
  );
}
