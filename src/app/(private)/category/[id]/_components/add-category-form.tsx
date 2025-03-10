"use client";

import { useCategoryCreate, useCategoryDetail, useCategoryUpdate } from "@/services/category";
import { Button, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiArrowLeftLine } from "react-icons/ri";

interface AddCategoryFormProps {
  id: string;
}

interface CategoryFormValue {
  name: string;
}
export default function AddCategoryForm(props: AddCategoryFormProps) {
  const isEdit = props.id !== "add";
  const { control, setValue, handleSubmit } = useForm<CategoryFormValue>({});
  const router = useRouter();
  const { mutate: createCategory } = useCategoryCreate();
  const { mutate: updateCategory } = useCategoryUpdate(props.id);
  const { mutate: getDetail } = useCategoryDetail(props.id);

  useEffect(() => {
    if (isEdit) {
      getDetail({}, {
        onSuccess: (res) => {
          setValue("name", res.data.name);
        },
        onError: () => {
          toast.error("Failed to fetch category");
        }
      });
    }
  }, [getDetail, isEdit, setValue]);

  const onSubmit = (value: CategoryFormValue) => {
    if (isEdit) {
      updateCategory(value, {
        onSuccess: () => {
          toast.success("Category updated successfully");
          router.push("/category");
        },
        onError: () => {
          toast.error("Failed to update category");
        },
      })
    } else {
      createCategory(value, {
        onSuccess: () => {
          toast.success("Category added successfully");
          router.push("/category");
        },
        onError: () => {
          toast.error("Failed to add category");
        },
      });
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() => router.push("/category")}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">{isEdit ? "Update" : "Add New"} Category</h1>
      </div>

      <div className="ml-12">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="name"
              rules={{ required: { value: true, message: "Name is required" } }}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  label="Category Name"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Name"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              )}
            />
            <div className="flex gap-4">
              <Button variant="bordered" onPress={() => router.push("/category")}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isEdit ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
