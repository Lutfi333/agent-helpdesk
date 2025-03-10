"use client";

import { Button, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import CardCustomer from "@/components/CardCustomer";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import { useCustomerList, useDeleteCustomer } from "@/services/customer";
import toast from "react-hot-toast";
import PaginationComponent from "@/app/_components/pagination";
import { Suspense } from "react";
import { useAuthMe } from "@/services/auth";

const CustomerContent: React.FC = () => {
  const router = useRouter();
  const qs = useSearchParams();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching: isUserFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  const paginationParams = useMemo(() => {
    return {
      page: currentPage,
      limit: Number(qs.get("limit")) || 6,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
    };
  }, [qs, currentPage]);

  const {
    data: customer,
    isFetching,
    refetch,
  } = useCustomerList(paginationParams);
  const { mutate: deleteCustomer } = useDeleteCustomer(selectedCustomer);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const handleConfirmDelete = () => {
    selectedCustomer &&
      deleteCustomer(selectedCustomer, {
        onSuccess: () => {
          onDeleteOpenChange();
          toast.success("Delete user successfully");
          refetch();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      });
  };

  const paginationSection = useCallback(() => {
    return (
      <Suspense fallback={<div></div>}>
        <div className="flex justify-center items-center gap-2">
          {customer?.data && !isFetching && paginationParams && (
            <PaginationComponent
              currentPage={paginationParams?.page ?? 1}
              totalItems={customer?.data.total ?? 0}
              limit={paginationParams?.limit ?? 10}
              setCurrentPage={(value) => {
                setCurrentPage(value);
              }}
            />
          )}
        </div>
      </Suspense>
    );
  }, [paginationParams, isFetching, customer?.data]);

  return (
    <div>
      <div className="flex md:justify-between gap-4 items-start mb-4">
        <h1 className="font-semibold text-xl">Our Customer</h1>
        {!isUserFetching && user?.role === "admin" && (
          <Button color="primary" onPress={() => router.push("/customers/add")}>
            Add New Customer
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        {!isFetching && customer?.data && (
          <>
            {customer?.data.list.map((v, i) => (
              <CardCustomer
                data={v}
                key={v.id}
                isShowAction
                onDetail={() => router.push(`/customers/${v.id}/detail`)}
                onEdit={() => router.push(`/customers/${v.id}/edit`)}
                onDelete={() => {
                  setSelectedCustomer(v.id);
                  onDeleteOpen();
                }}
                isFetching={isFetching}
              />
            ))}
          </>
        )}
      </div>
      {paginationSection()}
      <ModalConfirmDelete
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        onDelete={handleConfirmDelete}
        content="Are you sure to delete this customer?"
      />
    </div>
  );
};

export default CustomerContent;
