import { Suspense } from "react";
import AddCategoryForm from "./_components/add-category-form";

export default function AddCategoryPage(
  {
    params,
  }: {
    params: {
      id: string;
  }
  }
) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCategoryForm id={params.id} />
    </Suspense>
  );
}