"use client";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { RiMore2Fill } from "react-icons/ri";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import { useDeleteUser, useUserList } from "@/services/user";
import { UserList } from "@/services/user/types";
import { DateTime } from "luxon";
import { PiFolderMinusLight } from "react-icons/pi";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PaginationComponent from "@/app/_components/pagination";
import { useAuthMe } from "@/services/auth";
import TicketList from "../../tickets/_components/ticket-list";

const COLUMNS = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Role", key: "role" },
  { label: "Position", key: "position" },
  { label: "Category", key: "category" },
  { label: "Ticket Completed", key: "totalTicket" },
  { label: "Last Activity", key: "lastActivity" },
  { label: "Action", key: "action" },
];

const UserTable: React.FC = () => {
  const path = usePathname();
  const qs = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const router = useRouter();
  const paginationParams = useMemo(() => {
    return {
      page: currentPage,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      q: qs.get("q") || "",
    };
  }, [qs, currentPage]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const { data: userData, isFetching: isFetchingUser } = useAuthMe();

  const userMe = useMemo(() => userData?.data, [userData]);

  const { data: user, isFetching, refetch } = useUserList(paginationParams);
  const { mutate } = useDeleteUser(selectedUser);

  const handleDelete = () => {
    mutate(selectedUser, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        onDeleteOpenChange();
        setSelectedUser("");
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    });
  };

  const renderCell = useCallback(
    (item: UserList, key: React.Key) => {
      switch (key) {
        case "name":
          return (
            <div className="flex items-center gap-1">
              <Avatar
                size="sm"
                name={item.name
                  .split(/\s/)
                  .reduce((response, word, index) => {
                    response.length < 2 && (response += word.slice(0, 1));
                    return response;
                  }, "")
                  .toUpperCase()}
              />
              <div>{item.name}</div>
            </div>
          );
        case "email":
          return <>{item.email}</>;
        case "role":
          return <p className="capitalize">{item.role}</p>;
        case "position":
          return <>{item.jobTitle}</>;
        case "category":
          return <>{item.category.name}</>;
        case "totalTicket":
          return <>{item.totalTicketCompleted}</>;
        case "lastActivity":
          return (
            <>
              {item.lastActivityAt !== null
                ? DateTime.fromISO(item?.lastActivityAt ?? "")
                    .toLocal()
                    .toFormat("dd MMM yyyy, HH:mm")
                : "-"}
            </>
          );
        case "action":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" radius="full">
                  <RiMore2Fill />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key={"edit"}
                  onPress={() => router.push(`/users/${item.id}/edit`)}
                >
                  Edit
                </DropdownItem>
                <>
                  {item.id !== userMe?.id && (
                    <DropdownItem
                      key={"detail"}
                      onPress={() => {
                        router.push(`/users/${item.id}/detail`);
                      }}
                    >
                      Detail
                    </DropdownItem>
                  )}
                </>
                <>
                  {item.id !== userMe?.id && (
                    <DropdownItem
                      key={"delete"}
                      color="danger"
                      className="text-danger-500"
                      onPress={() => {
                        setSelectedUser(item.id);
                        onDeleteOpen();
                      }}
                    >
                      Delete
                    </DropdownItem>
                  )}
                </>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return "";
      }
    },
    [onDeleteOpen, router, userMe?.id],
  );

  const bottomContent = () => {
    return (
      <PaginationComponent
        currentPage={paginationParams?.page ?? 1}
        totalItems={user?.data.total ?? 0}
        limit={paginationParams?.limit ?? 10}
        setCurrentPage={(value) => {
          setCurrentPage(value);
        }}
      />
    );
  };

  return (
    <>
      <Table
        className="mb-4"
        removeWrapper
        border={1}
        bottomContent={bottomContent()}
      >
        <TableHeader columns={COLUMNS}>
          {(col) => <TableColumn key={col.key}>{col.label}</TableColumn>}
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
              <p className="mt-3 text-default-400">No User</p>
            </div>
          }
          items={user?.data.list ?? []}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(key) => (
                <TableCell className="border-b">
                  {renderCell(item, key)}
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
        content="Are you sure to delete this user?"
      />
    </>
  );
};

export default UserTable;
