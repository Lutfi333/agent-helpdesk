import { USER } from "@/constants/auth";
import {
  useCreateCustomer,
  useCustomerDetail,
  useUpdateCustomer,
  useUploadLogo,
} from "@/services/customer";
import { CustomerCreatePayload } from "@/services/customer/customer.types";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { ListCustomerData } from "@/services/customer/customer.list.types";
import { DateTime } from "luxon";
import { ChangeEvent } from "react";
import { BiUpload } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";

interface CustomerFormProps {
  id?: string;
  isEdit?: boolean;
}

interface CustomerData {
  name: string;
  email: string;
  logoAttachId: string;
  companyId: string;
  code: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isEdit, id }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState({ id: "", name: "" });

  const [customer, setCustomer] = useState<ListCustomerData[]>([]);
  useEffect(() => {
    setCustomer([]);
  }, []);

  const { control, handleSubmit, setValue } = useForm<CustomerCreatePayload>({
    mode: "all",
  });
  const { data: detail, isLoading } = useCustomerDetail(id ?? "");

  useEffect(() => {
    if (detail && id) {
      setValue("name", detail.data.name);
      setValue("code", detail.data.code);
      setValue("logoAttachId", detail.data.logo.name);
      setLogo({ id: detail.data.logo.id, name: detail.data.logo.name });
    }
  }, [detail, setValue, id]);

  const { mutate: createCustomer } = useCreateCustomer();
  const { mutate: updateCustomer } = useUpdateCustomer(id || "");

  const onSubmit = handleSubmit((data) => {
    if (isEdit) {
      updateCustomer(
        {
          name: data.name,
          logoAttachId: logo.id,
          code: data.code,
        },
        {
          onSuccess: (data) => {
            toast.success("User updated successfully");
            router.push("/customers");
          },
          onError: (e) => {
            toast.error(e.data.message);
          },
        },
      );
    } else {
      createCustomer(
        {
          name: data.name,
          email: data.email,
          logoAttachId: logo.id,
          code: data.code,
        },
        {
          onSuccess: () => {
            toast.success("Customer created successfully");
            router.push("/customers");
          },
          onError: () => {
            toast.error("Failed to create customer");
          },
        },
      );
    }
  });

  const { mutate: uploadLogo } = useUploadLogo();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append(
        "title",
        `Attachment-${DateTime.now().toMillis().toString()}`,
      );
      uploadLogo(formData, {
        onSuccess: (data) => {
          toast.success("Logo uploaded successfully");
          setLogo({
            id: data.data.id,
            name: data.data.name,
          });
          setValue("logoAttachId", data.data.name);
        },
        onError: () => {},
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <Controller
          name="name"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Name is required",
            },
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              id="name"
              label="Customer Name"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Customer Name"
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />
        {!isEdit && (
          <Controller
            name="email"
            rules={{
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                id="email"
                label="Customer Email"
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
        )}
        <Controller
          name="code"
          control={control}
          rules={{
            required: {
              value: true,
              message: "code is required",
            },
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: "Invalid code",
            },
            maxLength: {
              value: 5,
              message: "Code must be 5 characters long",
            },
          }}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              id="code"
              label="Customer Code"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Customer Code"
              isInvalid={invalid}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />
        <input
          accept="image/*, application/pdf, video/*"
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Controller
          name="logoAttachId"
          rules={{
            required: {
              value: true,
              message: "File is required",
            },
          }}
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              id="logoAttachId"
              label="Customer Logo"
              labelPlacement="outside"
              className="cursor-pointer hover:cursor-pointer"
              placeholder="Select Image"
              variant="bordered"
              onClick={() => fileInputRef.current?.click()}
              isInvalid={invalid}
              errorMessage={error?.message}
              endContent={
                <IoMdCloudUpload className="text-2xl cursor-pointer text-slate-500" />
              }
              {...field}
            />
          )}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="bordered" onPress={() => router.push("/customers")}>
          Cancel
        </Button>
        <Button type="submit" color="primary">
          {isEdit ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
