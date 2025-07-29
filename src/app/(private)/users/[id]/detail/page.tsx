import { Suspense } from "react";
import TicketList from "@/app/(private)/tickets/_components/ticket-list";

export default function TicketPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketList userID={params.id} />
    </Suspense>
  );
}
