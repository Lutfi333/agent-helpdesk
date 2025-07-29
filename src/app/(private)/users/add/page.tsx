"use client";
import { Suspense } from "react";
import UserAddContent from "./_components/user-add-content";

export default function TicketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAddContent />
    </Suspense>
  );
}
