import { Suspense } from "react";
import TaskList from "./_components/task-list";

export default function TaskPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskList />
    </Suspense>
  );
}
