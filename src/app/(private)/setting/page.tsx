import { Suspense } from "react";
import SettingContent from "./_components/setting-content";

export default function SettingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingContent />
    </Suspense>
  );
}