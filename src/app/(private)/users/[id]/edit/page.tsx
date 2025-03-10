"use client";
import { Suspense } from "react";
import UserEditContent from "./_components/user-edit-content";

export default function TicketPage({
  params,
}: {
  params: {
    id: string;
}
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserEditContent id={params.id}/>
    </Suspense>
  );
}
