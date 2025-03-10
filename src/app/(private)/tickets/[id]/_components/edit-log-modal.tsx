"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type EditLogModalProps = {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  totalSecond: number;
  id: string;
};

type EditLogForm = {
  hour: string;
  minute: string;
  second: string;
};
const EditLogModal = (props: EditLogModalProps) => {
  const { control, handleSubmit, setValue } = useForm<EditLogForm>({
    mode: "all",
  });

  useEffect(() => {
    const hours = Math.floor(props.totalSecond / 3600);
    const minutes = Math.floor((props.totalSecond % 3600) / 60);
    const seconds = Math.floor(props.totalSecond % 60);
    setValue("hour", hours.toString() ?? "0");
    setValue("minute", minutes.toString() ?? "0");
    setValue("second", seconds.toString() ?? "0");
  }, [props.totalSecond, setValue]);

  const { mutate: updateLogTime, isPending } = useHttpMutation(
    `/agent/ticket/time-track/update/${props.id}`,
    {
      method: "PUT",
      queryOptions: {
        onSuccess: function (data) {
          setValue("hour", "0");
          setValue("minute", "0");
          setValue("second", "0");
          toast.success("Log time updated successfully");
          props.onClose(true);
        },
        onError: function (data) {
          toast.error("Failed to update log time");
        },
      },
    },
  );

  const onSubmit = handleSubmit((data) => {
    updateLogTime({
      hour: parseInt(data.hour),
      minute: parseInt(data.minute),
      second: parseInt(data.second),
    });
  });

  return (
    <Modal
      size="xl"
      classNames={{ closeButton: "hidden" }}
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose(false);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader>Edit Log Time</ModalHeader>
            <ModalBody>
              <div>
                <div className="flex items-start justify-center space-x-2">
                  <Controller
                    name="hour"
                    rules={{
                      required: {
                        value: true,
                        message: "",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        type="number"
                        id="hour"
                        data-testid="hour"
                        min={0}
                        label="HH"
                        labelPlacement="outside"
                        placeholder="0"
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        className="max-w-[60px] text-center"
                        classNames={{ input: "text-center" }}
                        inputMode="numeric"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="minute"
                    rules={{
                      required: {
                        value: true,
                        message: "",
                      },
                      max: {
                        value: 59,
                        message: "Max 59",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        type="number"
                        id="minute"
                        data-testid="minute"
                        max={59}
                        min={0}
                        maxLength={2}
                        label="MM"
                        labelPlacement="outside"
                        placeholder="0"
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        className="max-w-[60px] text-center"
                        classNames={{ input: "text-center" }}
                        inputMode="numeric"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="second"
                    rules={{
                      required: {
                        value: true,
                        message: "",
                      },
                      max: {
                        value: 59,
                        message: "Max 59",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        type="number"
                        id="second"
                        data-testid="second"
                        max={59}
                        min={0}
                        maxLength={2}
                        label="SS"
                        labelPlacement="outside"
                        placeholder="0"
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        className="max-w-[60px] text-center"
                        classNames={{ input: "text-center" }}
                        inputMode="numeric"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={onClose}
                className="bg-red-400 text-white rounded-md"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white rounded-md ml-2"
              >
                Save
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditLogModal;
