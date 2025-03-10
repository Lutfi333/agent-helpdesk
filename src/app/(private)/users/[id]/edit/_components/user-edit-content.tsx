import { Button } from "@heroui/react";
import { RiArrowLeftLine } from "react-icons/ri";
import UserForm from "../../../_components/user-form";
import { useDetailUser, useUpdateUser } from "@/services/user";
import toast from "react-hot-toast";

interface Props {
  id: string;
}

const UserEditContent: React.FC<Props> = ({ id }) => {
  const router = useRouter();

  const { data: detail } = useDetailUser(id);

  const { mutate } = useUpdateUser(id);

  const onUpdateUser = (value: {
    name: string;
    role: string;
    email: string;
    jobTitle: string;
  }) => {
    mutate(value, {
      onSuccess: () => {
        toast.success("User added successfully");
        router.push("/users");
      },
      onError: () => {
        toast.error("Failed to add user");
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
        <h1 className="font-semibold text-xl">Update User Information</h1>
      </div>

      <div className="ml-12">
        <UserForm
          isEdit
          defaultValue={detail?.data}
          onCallback={onUpdateUser}
        />
      </div>
    </>
  );
};

export default UserEditContent;
