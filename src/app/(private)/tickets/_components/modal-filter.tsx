import { USER } from "@/constants/auth";
import Cookie from "js-cookie";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Chip,
} from "@heroui/react";
import { Fragment } from "react";
import { HiCheck } from "react-icons/hi";
import { useCustomerUserList } from "@/services/customer";

interface ModalFilterProps {
  isCustomer?: boolean;
  isOpen: boolean;
  onClose: (success: boolean) => void;
  selectedStatus: string;
  selectedSort: string;
  selectedCustomer: string;
  ticket: string;
  subject: string;
  submit: (data: SubmitData[]) => void;
  reset: () => void;
}

type Status = {
  id: string;
  name: string;
  selected: boolean;
};

type SubmitData = {
  key: string;
  value: string;
};

function ModalFilter(props: ModalFilterProps) {
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [ticket, setTicket] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const qs = useSearchParams();

  const data: Status[] = useMemo(
    () => [
      { id: "open", name: "Open", selected: false },
      { id: "in_progress", name: "In Progress", selected: false },
      { id: "resolve", name: "Resolve", selected: false },
      { id: "closed", name: "Closed", selected: false },
      { id: "cancel", name: "Cancel", selected: false },
    ],
    [],
  );

  const {
    data: customer,
    isFetching,
    refetch,
  } = useCustomerUserList({
    page: 1,
    limit: 100,
    sort: "createdAt",
    dir: "desc",
  });

  const user = useMemo(() => {
    const user = JSON.parse(Cookie.get(USER) ?? "{}");
    return user;
  }, []);

  useEffect(() => {
    let temp: Status[] = data.map((item) => {
      if (props.selectedStatus == "") {
        return item;
      }
      var listStatus = props.selectedStatus.split(",");
      for (let i = 0; i < listStatus.length; i++) {
        if (item.id == listStatus[i]) {
          return { ...item, selected: true };
        }
      }
      return item; // Add a default return value
    });
    const customerId = customer?.data.list.find(
      (item) => item.id == props.selectedCustomer,
    );

    setStatusList(temp);
    setSelectedSort(props.selectedSort);
    setSelectedCustomer(customerId?.id || "");
    setTicket(props.ticket);
    setSubject(props.subject);
  }, [props, data, customer]);

  const onReset = () => {
    let temp = statusList.map((item) => {
      return { ...item, selected: false };
    });
    setStatusList(temp);
    setSelectedSort("");
    setSelectedCustomer("");
    setSubject("");
    props.reset();
  };

  const onSubmitFilter = () => {
    let status = statusList
      .filter((item) => item.selected)
      .map((item) => item.id)
      .join(",");
    const data: SubmitData[] = [
      { key: "status", value: status },
      { key: "sort", value: selectedSort },
      ...(props.isCustomer
        ? []
        : [{ key: "companyProductID", value: selectedCustomer }]),
      { key: "id", value: ticket },
      { key: "subject", value: subject },
    ];
    props.submit(data);
  };

  const onAddSelectedStatus = (status: Status) => {
    let temp = statusList.map((item) => {
      if (item.id == status.id) {
        if (item.selected) {
          return { ...item, selected: false };
        }
        return { ...item, selected: true };
      }
      return item;
    });
    setStatusList(temp);
  };

  const renderStatus = (status: Status) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger" = "default";

    switch (status.id) {
      case "open":
        color = "success";
        break;
      case "in_progress":
        color = "secondary";
        break;
      case "resolve":
        color = "warning";
        break;
      case "close":
        color = "primary";
        break;
      case "cancel":
        color = "danger";
        break;
      default:
        color = "default";
    }

    return (
      <Fragment key={status.id}>
        <Chip
          aria-label="status"
          onClick={() => onAddSelectedStatus(status)}
          endContent={
            status.selected && (
              <div className="ml-1 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
                <HiCheck className="h-3 w-3 text-white" />
              </div>
            )
          }
          className="capitalize cursor-pointer"
          size="sm"
          variant="solid"
          color={color}
        >
          {status.name}
        </Chip>
      </Fragment>
    );
  };

  return (
    <Modal
      aria-label="filter"
      size="xl"
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose(false);
      }}
    >
      <ModalContent>
        {(onClose) => {
          return (
            <>
              <ModalHeader className="justify-center">
                <h1 className="font-semibold text-xl">Filter</h1>
              </ModalHeader>
              <ModalBody>
                <form className="space-y-2">
                  <Select
                    aria-label="sort"
                    id="sort"
                    size="sm"
                    label="Sort by"
                    className="w-full"
                    defaultSelectedKeys={[selectedSort || "createdAt"]}
                    onChange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      if (!target.value) {
                        return;
                      }
                      setSelectedSort(target.value);
                    }}
                  >
                    <SelectItem
                      key="createdAt"
                      value="createdAt"
                      isDisabled={selectedSort === "createdAt"} // Disable if already selected
                    >
                      Date Created
                    </SelectItem>
                    <SelectItem
                      key="updatedAt"
                      value="updatedAt"
                      isDisabled={selectedSort === "updatedAt"} // Disable if already selected
                    >
                      Last Modified
                    </SelectItem>
                  </Select>
                  {props.isCustomer ? null : (
                    <Select
                      aria-label="customer"
                      id="companyProductID"
                      size="sm"
                      label="Select Customer"
                      className="w-full"
                      value={selectedCustomer || ""}
                      defaultSelectedKeys={[selectedCustomer || ""]}
                      onChange={(e) => {
                        const target = e.target as HTMLSelectElement;
                        setSelectedCustomer(target.value);
                      }}
                    >
                      {customer?.data.list.map((item, index) => (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name}
                        </SelectItem>
                      )) ?? []}
                    </Select>
                  )}
                  <Input
                    id="id"
                    aria-label="search"
                    placeholder="Search by Ticket ID"
                    size="lg"
                    radius="sm"
                    value={ticket}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setTicket(target.value);
                    }}
                  />
                  <Input
                    id="subject"
                    aria-label="search"
                    placeholder="Search by Subject"
                    size="lg"
                    radius="sm"
                    value={subject}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setSubject(target.value);
                    }}
                  />
                </form>
                <div className="grid-cols space-x-2">
                  {statusList.map((status) => renderStatus(status))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  aria-label="close"
                  onPress={() => {
                    onReset();
                  }}
                  className="bg-white text-default-700 border-primary px-4 py-2 rounded-md"
                  variant="bordered"
                >
                  Reset
                </Button>
                <Button
                  aria-label="filter"
                  onPress={() => {
                    onSubmitFilter();
                  }}
                  className="bg-primary text-white rounded-md ml-2"
                >
                  Filter
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
}

export default ModalFilter;
