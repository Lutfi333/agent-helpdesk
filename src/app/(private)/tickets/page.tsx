import { Suspense } from "react";
import TicketList from "./_components/ticket-list";

export default function TicketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketList />
    </Suspense>
  );
}
