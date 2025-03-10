"use client";
import { USER } from "@/constants/auth";
import { useTaskList, useTicketList } from "@/services/ticket";
import { ListTicketDatum } from "@/services/ticket/ticket.list.types";
import {
  Button,
  Chip,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import Cookie from "js-cookie";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useCallback, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { PiFolderMinusLight } from "react-icons/pi";
import PaginationComponent from "@/app/_components/pagination";
import ModalFilter from "../../tickets/_components/modal-filter";

export default function TaskList() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [columns, setColumns] = useState([
    {
      key: "ticket_id",
      uid: "ticket_id",
      name: "Ticket ID",
      sortable: false,
    },
    { key: "customer", uid: "customer", name: "Customer", sortable: false },
    { key: "subject", uid: "subject", name: "Subject", sortable: false },
    {
      key: "created_at",
      uid: "created_at",
      name: "Created on",
      sortable: false,
    },
    {
      key: "close_at",
      uid: "close_at",
      name: "Closed at",
      sortable: false,
    },
    { key: "priority", uid: "priority", name: "Priority", sortable: false },
    { key: "status", uid: "status", name: "Status", sortable: false },
    { key: "actions", uid: "actions", name: "Action", sortable: false },
  ]);

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openExport, setOpenExport] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  const user = useMemo(() => {
    const user = JSON.parse(Cookie.get(USER) ?? "{}");
    return user;
  }, []);

  const paginationParams = useMemo(() => {
    if (qs.get("id") !== null && qs.get("id") !== "")
      setSearchCode(qs.get("id") ?? "");
    return {
      page: Number(qs.get("page")) || 1,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      status: qs.get("status") || "",
      subject: qs.get("subject") || "",
      code: qs.get("id") || "",
      companyProductID: qs.get("companyProductID") || "",
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

  const { data: tickets, isFetching } = useTaskList(paginationParams);

  const onsubmitSearchId = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const search = target.searchId;
    router.push(`${path}?${createQueryString("ticket_id", search.value)}`);
  };
  
  const renderStatus = useCallback((status: string) => {
    let color = "";
    switch (status) {
      case "open":
        color = "bg-green-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      case "cancel":
        color = "bg-red-400";
        break;
      default:
        color = "bg-blue-500";
    }
    return (
      <Chip
        startContent={
          <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
        }
        className="capitalize"
        size="sm"
        variant="bordered"
      >
        {status.replace("_", " ")}
      </Chip>
    );
  }, []);

  const renderCell = useCallback(
    (row: ListTicketDatum, key: Key) => {
      switch (key) {
        case "ticket_id":
          return <p>{row.code}</p>;
        case "customer":
          return (
            <div className="rounded bg-slate-200 py-1 px-3 inline-flex gap-2 items-center">
              {/* <Image
                width={16}
                height={16}
                alt="LOGO"
                className="flex-none"
                src={row.customer.}
              /> */}
              <span className="text-sm font-semibold">{row.product.name}</span>
            </div>
          );
        case "subject":
          return (
            <p className="text-bold text-small text-ellipsis">{row.subject}</p>
          );
        case "created_at":
          return <>{DateTime.fromISO(row.createdAt).toFormat("dd/MM/yyyy")}</>;
        case "close_at":
          return (
            <>
              {row.closedAt &&
                DateTime.fromISO(row.closedAt).toFormat("dd/MM/yyyy")}
            </>
          );
        case "priority":
          return <>{row.priority}</>;
        case "status":
          return <>{renderStatus(row.status)}</>;
        case "actions":
          return <Link href={`/tickets/${row.id}`}>View</Link>;
        default:
          return <></>;
      }
    },
    [renderStatus],
  );

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
        totalItems={tickets?.data.total ?? 0}
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
            All My Task
          </h1>
          <p className="text-sm text-gray-500">Manage and Track Task</p>
        </div>

        <div className="flex gap-4 items-center">
          <form onSubmit={onsubmitSearch} className="flex justify-evenly">
            <Input
              id="search"
              aria-label="search"
              variant="bordered"
              endContent={<FaSearch />}
              placeholder="Search by Ticket ID"
              value={searchCode}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSearchCode(target.value);
                if (target.value === "") {
                  router.push(`${path}?${createQueryString("id", "")}`);
                }
              }}
            />
          </form>
          <Button
            aria-label="filter"
            className="flex-none"
            startContent={<HiOutlineFilter size={20} />}
            onPress={() => setOpenFilter(!openFilter)}
          >
            Filter
          </Button>
        </div>
      </div>

      <div className="mb-4 border rounded p-4">
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
            items={tickets?.data?.list ?? []}
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
