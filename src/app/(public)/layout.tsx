import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="w-screen h-[calc(100vh)]">{children}</div>
    </main>
  );
}
