import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useCategory } from "@/services/category";
import { CategoryList } from "@/services/category/types";

interface UserFormProps {
  isEdit?: boolean;
  defaultValue?: any;
  onCallback?: (value: {
    name: string;
    role: string;
    email: string;
    jobTitle: string;
    categoryId: string;
  }) => void;
}

interface UserFormValue {
  name: string;
  role: string;
  email: string;
  jobTitle: string;
  categoryId: string;
}

const UserForm: React.FC<UserFormProps> = ({
  isEdit,
  defaultValue,
  onCallback,
}) => {
  const { control, setValue, handleSubmit } = useForm<UserFormValue>({
    mode: "all",
  });
  const router = useRouter();

  const { data: category } = useCategory({
    page: 1,
    limit: 100,
    sort: "name",
    dir: "asc",
  });

  const onSubmit = (value: UserFormValue) => {
    onCallback && onCallback(value);
  };

  useEffect(() => {
    setValue("role", "admin");
    if (defaultValue) {
      setValue("name", defaultValue.name);
      setValue("role", defaultValue.role);
      setValue("email", defaultValue.email);
      setValue("jobTitle", defaultValue.jobTitle);
      if (defaultValue?.category?.id) {
        setValue("categoryId", defaultValue.category.id);
      }
    }
  }, [defaultValue, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="name"
          rules={{ required: { value: true, message: "Name is required" } }}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              label="Name"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Name"
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
            required: {
              value: true,
              message: "Email is required",
            },
          }}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              label="Email"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Email"
              type="email"
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="jobTitle"
          rules={{ required: { value: true, message: "Position is required" } }}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              label="Position"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Position"
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: { value: true, message: "Category is required" } }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Select
              label="Category"
              labelPlacement="outside"
              placeholder="Select Category"
              size="lg"
              radius="md"
              variant="bordered"
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            >
              {category?.data?.list?.map((categoryData: CategoryList) => (
                <SelectItem value={categoryData.id} key={categoryData.id}>
                  {categoryData.name}
                </SelectItem>
              )) || []}
            </Select>
          )}
        />
        <p className="text-sm">Role</p>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RadioGroup
              color="primary"
              // defaultValue={defaultValue?.role || "admin"}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              {...field}
            >
              <Radio value="admin">
                <p className="text-sm">Admin</p>
              </Radio>
              <Radio value="agent">
                <p className="text-sm">Agent</p>
              </Radio>
            </RadioGroup>
          )}
        />
        <div className="flex gap-4">
          <Button variant="bordered" onPress={() => router.push("/users")}>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
