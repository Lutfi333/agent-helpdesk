import { Suspense } from "react";
import CategoryContent from "./_components/category-content";

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}