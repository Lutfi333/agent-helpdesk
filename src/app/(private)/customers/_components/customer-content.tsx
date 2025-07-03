"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Spinner,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { HiPlus } from "react-icons/hi";
import {
  FaSearch,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuthMe } from "@/services/auth";
import {
  useCustomerList,
  useDeleteCustomer,
  useCustomerUserList,
  useDeleteCustomerUser,
} from "@/services/customer";
import { UserList } from "@/services/user/types";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import { PiFolderMinusLight } from "react-icons/pi";

export default function CustomerManagement() {
  const router = useRouter();
  const qs = useSearchParams();
  const path = usePathname();

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const { data: userData } = useAuthMe();
  const user = useMemo(() => userData?.data, [userData]);

  const paginationParams = useMemo(() => {
    const q = qs.get("q") || "";
    if (q) setSearchValue(q);
    return {
      page: currentPage,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      q,
    };
  }, [qs, currentPage]);

  const { data, isFetching, refetch } = useCustomerUserList(paginationParams);
  const { mutate: deleteCustomer } = useDeleteCustomerUser(selectedCustomer);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const handleDelete = () => {
    selectedCustomer &&
      deleteCustomer(selectedCustomer, {
        onSuccess: () => {
          setIsOpenDelete(false);
          toast.success("Customer deleted successfully");
          refetch();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      });
  };

  const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${path}?${createQueryString("q", searchValue)}`);
  };

  const columns = [
    { key: "name", uid: "name", name: "Name" },
    { key: "email", uid: "email", name: "Email" },
    { key: "createdAt", uid: "createdAt", name: "Created At" },
    { key: "actions", uid: "actions", name: "Action" },
  ];

  const renderCell = (customer: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return <p>{customer?.name}</p>;
      case "email":
        return <p>{customer?.email}</p>;
      case "createdAt":
        return (
          <p>
            {customer.createdAt
              ? DateTime.fromISO(customer.createdAt).toFormat("dd MMM yyyy")
              : "-"}
          </p>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <FaEllipsisV />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {/* <DropdownItem
                key="detail"
                onPress={() => router.push(`/customers/${customer.id}/detail`)}
              >
                Detail
              </DropdownItem> */}
              <DropdownItem
                key="edit"
                onPress={() => router.push(`/customers/${customer.id}/edit`)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onPress={() => {
                  setSelectedCustomer(customer.id);
                  setIsOpenDelete(true);
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
    }
  };

  const bottomContent = () => (
    <Suspense fallback={<div></div>}>
      <div className="flex items-center justify-center gap-4">
        <p className="text-sm text-gray-500">
          Total {data?.data?.total ?? 0} Customers
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="bordered"
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
            Prev
          </Button>
          <Pagination
            page={currentPage}
            total={Math.ceil((data?.data.total ?? 0) / paginationParams.limit)}
            onChange={setCurrentPage}
            variant="bordered"
            showControls={false}
          />
          <Button
            variant="bordered"
            onPress={() =>
              setCurrentPage((p) =>
                p < Math.ceil((data?.data.total ?? 0) / paginationParams.limit)
                  ? p + 1
                  : p,
              )
            }
            disabled={
              currentPage >=
              Math.ceil((data?.data.total ?? 0) / paginationParams.limit)
            }
          >
            Next
            <FaChevronRight />
          </Button>
        </div>
      </div>
    </Suspense>
  );

  return (
    <div className="bg-white rounded-lg shadow-md w-full mt-4">
      <div className="flex items-center justify-between p-4 border-b">
        <p className="text-lg font-semibold">Customer Management</p>
        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={onSubmitSearch} className="flex items-center gap-2">
            <Input
              placeholder="Search by name"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (!e.target.value) {
                  router.push(`${path}?${createQueryString("q", "")}`);
                }
              }}
              size="sm"
              endContent={<FaSearch />}
            />
          </form>
          {user?.role === "admin" && (
            <Button
              size="sm"
              className="bg-primary text-white"
              onPress={() => router.push("/customers/add")}
              startContent={<HiPlus />}
            >
              Add New Customer
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <Table
          isStriped
          bottomContent={bottomContent()}
          bottomContentPlacement="outside"
          classNames={{ wrapper: "p-0 rounded-md" }}
          aria-label="Customer List"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
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
                <p className="mt-3 text-default-400">No Customers</p>
              </div>
            }
            items={data?.data.list ?? []}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ModalConfirmDelete
        isOpen={isOpenDelete}
        onOpenChange={() => setIsOpenDelete(false)}
        onDelete={handleDelete}
        content="Are you sure you want to delete this customer?"
      />
    </div>
  );
}
