
import { Suspense } from "react";
import CustomerUserContent from "./_components/customer-user-content";

export default function CustomerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerUserContent />
    </Suspense>
  );
}
