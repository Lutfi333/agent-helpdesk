"use client";
import { Button } from "@heroui/react";
import CustomerForm from "../../_components/customer-form";
import { RiArrowLeftLine } from "react-icons/ri";

interface Props {
  id?: string;
}

export default function CustomerEditContent(props: Props) {
  const router = useRouter();
  const { id } = props;

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
        <h1 className="font-semibold text-xl">Update Customer Information</h1>
      </div>

      <CustomerForm isEdit id={id} />
    </>
  );
}
