"use client";

import { useCategory, useCategoryDelete } from "@/services/category";
import { CategoryList } from "@/services/category/types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  Spinner,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { PiFolderMinusLight } from "react-icons/pi";
import { RiAddLine, RiMore2Fill } from "react-icons/ri";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import toast from "react-hot-toast";
import PaginationComponent from "@/app/_components/pagination";

export default function CategoryContent() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { mutate } = useCategoryDelete(selectedCategory);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [columns, setColumns] = useState([
    {
      key: "category_name",
      uid: "category_name",
      name: "Category",
      sortable: false,
    },
    {
      key: "created_at",
      uid: "created_at",
      name: "Created on",
      sortable: false,
    },
    { key: "actions", uid: "actions", name: "Action", sortable: false },
  ]);

  const paginationParams = useMemo(() => {
    return {
      page: Number(qs.get("page")) || 1,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
    };
  }, [qs]);

  const { data: category, isFetching, refetch } = useCategory(paginationParams);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const handleDelete = () => {
    mutate(selectedCategory, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        onDeleteOpenChange();
        setSelectedCategory("");
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete category");
      },
    });
  };

  const renderCell = useCallback(
    (row: CategoryList, key: React.Key) => {
      switch (key) {
        case "category_name":
          return (
            <p className="text-bold text-small text-ellipsis">{row.name}</p>
          );
        case "created_at":
          return <>{DateTime.fromISO(row.createdAt).toFormat("dd/MM/yyyy")}</>;
        case "actions":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" radius="full">
                  <RiMore2Fill />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onPress={() => router.push(`/category/${row.id}`)}
                  key={"edit"}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  className="text-danger-500"
                  onPress={() => {
                    setSelectedCategory(row.id);
                    onDeleteOpen();
                  }}
                  key={"delete"}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return <></>;
      }
    },
    [router, onDeleteOpen, setSelectedCategory],
  );

  const bottomContent = () => {
    return (
      <PaginationComponent
        currentPage={paginationParams?.page ?? 1}
        totalItems={category?.data.total ?? 0}
        limit={paginationParams?.limit ?? 10}
        setCurrentPage={(value) => {
          router.push(`${path}?${createQueryString("page", value.toString())}`);
        }}
      />
    );
  };

  return (
    <>
      <div className="flex md:justify-between gap-4 items-end mb-4">
        <div>
          <h1 className="font-semibold text-xl mb-1">
            Ticket Category Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage and Track Ticket Category
          </p>
        </div>
        <div>
          <Button
            className="flex-none"
            color="primary"
            endContent={<RiAddLine />}
            onPress={() => router.push("/category/add")}
          >
            Add New Category
          </Button>
        </div>
      </div>

      <div className="mb-4 border rounded p-4">
        <Table
          className="mb-4"
          removeWrapper
          border={1}
          bottomContent={bottomContent()}
        >
          <TableHeader columns={columns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody
            isLoading={isFetching}
            loadingContent={
              <div className="flex h-60 flex-col items-center justify-center text-sm">
                <Spinner />
                <p className="mt-3 text-default-400">Loading...</p>
              </div>
            }
            emptyContent={
              <div className="flex h-60 flex-col items-center justify-center text-sm">
                <PiFolderMinusLight size={20} />
                <p className="mt-3 text-default-400">No Category</p>
              </div>
            }
            items={category?.data.list ?? []}
          >
            {(row) => (
              <TableRow key={row.id}>
                {(key) => (
                  <TableCell className="border-b">
                    {renderCell(row, key)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ModalConfirmDelete
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          onDelete={handleDelete}
          content="Are you sure to delete this category?"
        />
      </div>
    </>
  );
}
