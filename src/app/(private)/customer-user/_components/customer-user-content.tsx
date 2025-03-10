"use client";

import {
  Avatar,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useCallback, useMemo, useState } from "react";
import { PiFolderMinusLight } from "react-icons/pi";
import PaginationComponent from "@/app/_components/pagination";
import ModalFilter from "../../tickets/_components/modal-filter";
import { useCustomerUserList } from "@/services/customer";
import { CustomerUserList } from "@/services/customer/customer-user.types";

export default function CustomerUserContent() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [columns, setColumns] = useState([
    {
      key: "user_photo",
      uid: "user_photo",
      name: "User Photo",
      sortable: false,
    },
    { key: "customer", uid: "customer", name: "Customer", sortable: false },
    { key: "email", uid: "email", name: "Email", sortable: false },
    { key: "actions", uid: "actions", name: "Action", sortable: false },
  ]);

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  const paginationParams = useMemo(() => {
    return {
      page: Number(qs.get("page")) || 1,
      limit: Number(qs.get("limit")) || 10,
    };
  }, [qs]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const { data: userCustomer, isFetching } =
    useCustomerUserList(paginationParams);

  const renderCell = useCallback((row: CustomerUserList, key: Key) => {
    switch (key) {
      case "user_photo":
        return <Avatar src={row.profilePicture.url} />;
      case "customer":
        return <p className="text-sm font-semibold">{row.name}</p>;
      case "email":
        return <>{row.email}</>;
      case "actions":
        return <Link href={`/customers/${row.id}/detail`}>View</Link>;
      default:
        return <></>;
    }
  }, []);

  const onsubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const search = target.search;
    router.push(`${path}?${createQueryString("id", search.value)}`);
  };

  const bottomContent = () => {
    return (
      <PaginationComponent
        currentPage={paginationParams?.page ?? 1}
        totalItems={userCustomer?.data.total ?? 0}
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
          <h1 className="font-semibold text-xl mb-1">All Customer</h1>
        </div>
      </div>

      <div className="mb-4 border rounded-md p-4">
        <Table
          aria-label="Ticket Table"
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
                <p className="mt-3 text-default-400">No Ticket</p>
              </div>
            }
            items={userCustomer?.data?.list ?? []}
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
      </div>

      <ModalFilter
        isOpen={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
        selectedSort={qs.get("sort") || "createdAt"}
        selectedStatus={qs.get("status") || ""}
        ticket={qs.get("id") || ""}
        subject={qs.get("subject") || ""}
        selectedCustomer={qs.get("companyProductID") || ""}
        reset={() => {
          setOpenFilter(false);
          setSearchCode("");
          router.push(path);
        }}
        submit={(
          data: {
            key: string;
            value: string;
          }[],
        ) => {
          setOpenFilter(false);
          let query = "";
          data.forEach((item) => {
            query += `${item.key}=${item.value}&`;
          });
          router.push(`${path}?${query}`);
        }}
      />
    </>
  );
}
