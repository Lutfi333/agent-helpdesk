"use client";

import { Button, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";
import ChartLine from "@/components/ChartLine";
import CustomerTicketList from "./customer-ticket-list";
import { RiArrowLeftLine } from "react-icons/ri";
import CardCustomer from "@/components/CardCustomer";
import { useCustomerDetail, useCustomerUserDetail } from "@/services/customer";
import { useAuthMe } from "@/services/auth";
import CardCustomerUser from "@/components/CardCustomerUser";

interface Props {
  id: string;
}

export default function CustomerDetailContent(props: Props) {
  const { id } = props;
  const router = useRouter();

  const { data, isFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  const { data: detail, isLoading } = useCustomerDetail(id);
  const { data: customerDetail, isLoading: isCustomerDetailLoading } =
    useCustomerUserDetail(id);

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() => user?.company.type == "B2C" ? router.push("/customer-user") : router.push("/customers")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">{user?.company.type == "B2C" ? customerDetail?.data.name : detail?.data.name}</h1>
      </div>

      <div className="grid md:grid-cols-2 items-center gap-4 mb-4">
        <div>
          {user?.company.type == "B2C" ? (
            <CardCustomerUser
              data={customerDetail?.data}
              isFetching={isCustomerDetailLoading}
            />
          ) : (
            <CardCustomer isDetail data={detail?.data} isFetching={isLoading} />
          )}
        </div>

        <ChartLine
          height={200}
          companyProductID={id}
          isB2C={user?.company.type == "B2C"}
        />
      </div>

      <CustomerTicketList id={id} />
    </>
  );
}
