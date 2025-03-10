"use client";
import { Button } from "@heroui/react";
import { RiArrowLeftLine } from "react-icons/ri";
import UserForm from "../../_components/user-form";
import { useCreateUser } from "@/services/user";
import toast from "react-hot-toast";

const UserAddContent: React.FC = () => {
  const router = useRouter();

  const { mutate } = useCreateUser();

  const onAddUser = (value: {
    name: string;
    email: string;
    jobTitle: string;
  }) => {
    mutate(value, {
      onSuccess: () => {
        toast.success("User added successfully");
        router.push("/users");
      },
      onError: (e) => {
        toast.error(e.data.message);
      },
    });
  };

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() => router.push("/users")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">Add New User</h1>
      </div>

      <div className="ml-12">
        <UserForm onCallback={(value) => onAddUser(value)} />
      </div>
    </>
  );
};

export default UserAddContent;
