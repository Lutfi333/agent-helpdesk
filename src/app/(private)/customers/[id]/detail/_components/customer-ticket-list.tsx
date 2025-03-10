import ModalFilter from "@/app/(private)/tickets/_components/modal-filter";
import { USER } from "@/constants/auth";
import { useTicketList } from "@/services/ticket";
import { ListTicketDatum } from "@/services/ticket/ticket.list.types";
import {
  Button,
  Chip,
  Input,
  Pagination,
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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import { PiFolderMinusLight } from "react-icons/pi";
import PaginationComponent from "@/app/_components/pagination";

interface CustomerTicketListProps {
  id: string;
  isB2C?: boolean;
}

export default function CustomerTicketList(props: CustomerTicketListProps) {
  const { isB2C = false } = props;
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [subject, setSubject] = useState("");
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
      ...(isB2C
        ? { customerID: props.id }
        : { companyProductID: props.id || "" }),
    };
  }, [qs, setSearchCode, props.id, isB2C]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const { data: tickets, isFetching } = useTicketList(paginationParams);

  const onsubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const search = target.search;
    router.push(`${path}?${createQueryString("subject", search.value)}`);
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
          return <>{row.code}</>;
        case "customer":
          return (
            <div className="rounded bg-slate-200 py-1 px-3 inline-flex gap-2 items-center">
              <span className="text-sm font-semibold">{row.customer.name}</span>
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
            All Tickets from Customer
          </h1>
          <p className="text-sm text-gray-500">Manage and Track Tickets</p>
        </div>

        <div className="flex gap-4 items-center">
          <form onSubmit={onsubmitSearch} className="flex justify-evenly">
            <Input
              id="search"
              aria-label="search"
              placeholder="Search by Subject"
              size="sm"
              radius="sm"
              endContent={
                <button
                  type="submit"
                  className="text-gray-500 hover:text-black"
                >
                  <FaSearch />
                </button>
              }
              value={subject}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSubject(target.value);
                if (target.value === "") {
                  router.push(`${path}?${createQueryString("subject", "")}`);
                }
              }}
            />
          </form>
          <Button
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
        isCustomer
        isOpen={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
        selectedSort={qs.get("sort") || "createdAt"}
        selectedStatus={qs.get("status") || ""}
        ticket={qs.get("ticket_id") || ""}
        subject={qs.get("subject") || ""}
        selectedCustomer={qs.get("customerID") || "createdAt"}
        reset={() => {
          setOpenFilter(false);
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
            query +=
              item.key === "filterTicket"
                ? `customerID=${item.value === "my" ? user.id : ""}&`
                : `${item.key}=${item.value}&`;
          });
          router.push(`${path}?${query}`);
        }}
      />
    </>
  );
}
