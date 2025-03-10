import { useDetailCompany } from "@/services/company";
import { ListCustomerData } from "@/services/customer/customer.list.types";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import { RiMore2Fill } from "react-icons/ri";
import Cookie from "js-cookie";
import { USER } from "@/constants/auth";

interface CardCustomerProps {
  data?: ListCustomerData;
  isShowAction?: boolean;
  isDetail?: boolean;
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isFetching?: boolean;
}

const CardCustomer: React.FC<CardCustomerProps> = ({
  data,
  isShowAction,
  isDetail,
  onDetail,
  onEdit,
  onDelete,
  isFetching,
}) => {
  const router = useRouter();

  const { data: company, refetch: refetchCompany } = useDetailCompany();

  const user = useMemo(() => {
    const user = JSON.parse(Cookie.get(USER) ?? "{}");

    return user;
  }, []);

  return (
    <div className="border bg-white px-6 py-4 shadow rounded relative">
      {isShowAction ? (
        user?.role === "admin" ? (
          <Dropdown aria-label="Actions">
            <DropdownTrigger>
              <Button
                className="absolute top-2 right-2"
                isIconOnly
                radius="full"
                variant="light"
              >
                <RiMore2Fill />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key={"detail"}
                onPress={() => onDetail && onDetail()}
              >
                Detail
              </DropdownItem>
              <DropdownItem key={"edit"} onPress={() => onEdit && onEdit()}>
                Edit
              </DropdownItem>
              <DropdownItem
                key={"delete"}
                color="danger"
                className="text-danger-500"
                onPress={() => onDelete && onDelete()}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="absolute top-2 right-2"
                isIconOnly
                radius="full"
                variant="light"
              >
                <RiMore2Fill />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key={"detail"}
                onPress={() => onDetail && onDetail()}
              >
                Detail
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )
      ) : null}

      {!isDetail && (
        <h3 className="font-semibold text-lg mb-4">{data?.name}</h3>
      )}

      <div className="flex gap-6 items-center">
        <div>
          {!isFetching && (
            <Image
              width={100}
              height={100}
              src={data && data?.logo.url}
              alt="Profile"
              className="h-16 rounded-md object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h6 className="font-semibold text-sm">Total Ticket Submited</h6>
            <p className="text-gray-500 text-sm">{data?.ticketTotal} tickets</p>
          </div>
          {isDetail && (
            <>
              <div>
                <h6 className="font-semibold text-sm">Domain</h6>
                <a href="#" className=" text-sm text-primary">
                  {company?.data?.settings.domain.fullUrl}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCustomer;
