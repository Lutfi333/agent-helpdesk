"use client"
import { Suspense } from "react";
import UserContent from "./_components/user-content";

export default function TicketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserContent />
    </Suspense>
  );
}
