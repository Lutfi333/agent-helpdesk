"use client";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import CustomerForm from "../../[id]/_components/customer-form";
import { RiArrowLeftLine } from "react-icons/ri";

const CustomerAddContent: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() => router.push("/customers")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">Add New Customer</h1>
      </div>

      <CustomerForm />
    </>
  );
};

export default CustomerAddContent;
