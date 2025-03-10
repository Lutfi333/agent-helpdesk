import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button, Pagination } from "@heroui/react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  setCurrentPage: (page: number) => void;
}

const PaginationComponent = ({
  currentPage,
  totalItems,
  limit,
  setCurrentPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="flex items-center justify-center gap-4">
      <p className="text-sm text-gray-500">Total {totalItems ?? 0} Item</p>
      
      {totalPages > 0 && (
        <div className="flex items-center gap-2">
          <Button
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            isDisabled={currentPage <= 1}
            className="h-9"
            variant="bordered"
          >
            <FaChevronLeft />
            Prev
          </Button>

          <Pagination
            showControls={false}
            classNames={{ cursor: "bg-black text-white" }}
            disableAnimation
            color="primary"
            page={currentPage}
            total={totalPages}
            variant="bordered"
            onChange={setCurrentPage}
          />

          <Button
            onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
            className="h-9"
            variant="bordered"
          >
            Next
            <FaChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginationComponent;
