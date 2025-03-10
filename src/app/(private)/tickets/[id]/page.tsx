import { Suspense } from "react";
import TicketDetail from "./_components/ticket-detail";

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
  searchParams: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketDetail params={params.id} />
    </Suspense>
  );
}
