"use client";

import { secondsToHms } from "@/common/func/time";
import {
  useAttachmentDetail,
  useUploadAttachment,
} from "@/services/attachment";
import {
  useAddToMyTask,
  useCommentList,
  useCreateComment,
  usePauseTime,
  useResumeTime,
  useTicketDetail,
} from "@/services/ticket";
import { ListCommentData } from "@/services/ticket/comment.types";
import { Attachment } from "@/services/ticket/detail.ticket.types";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Spinner,
  Textarea,
} from "@heroui/react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { ChangeEvent, Fragment, ReactNode, useMemo, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiLock, BiStopwatch } from "react-icons/bi";
import { HiArrowUp, HiCheck, HiTrash } from "react-icons/hi";
import {
  RiArrowLeftLine,
  RiAttachment2,
  RiSendPlane2Line,
} from "react-icons/ri";
import ImageViewModal from "./image-view-modal";
import PauseResume from "./pause-resume";
import { useConfigMutation } from "@/services/setting";
import { useCustomerDetailMutation } from "@/services/customer";
import AlertCreditHourModal from "./alert-credit-hour-modal";

interface DetailProps {
  params: string;
}

type FileList = {
  url: string;
  size: number;
  fileName: string;
  id: string;
  isUploaded: boolean;
  file: File;
};

type Status = {
  id: string;
  name: string;
};

export default function TicketDetail(props: DetailProps) {
  const LIMIT_COMMENT = 5;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [customerBalance, setCustomerBalance] = useState<number>(0);

  const [fileList, setFileList] = useState<FileList[]>([]);
  const [selectedAttachment, setSelectedAttachment] = useState<string>("");
  const [commentText, setCommentText] = useState<ListCommentData[]>([]);

  const { mutate: createComment } = useCreateComment();
  const { mutate: uploadAttachment } = useUploadAttachment();
  const { mutate: getAttachment } = useAttachmentDetail(selectedAttachment);
  const { mutate: assignToMe, isPending } = useAddToMyTask(props.params);
  const { mutate: checkCompany } = useCustomerDetailMutation(customerId);
  const { mutate: checkConfig } = useConfigMutation();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    sort: "createdAt",
    dir: "desc",
  });
  const [attachment, setAttachment] = useState<Attachment>({
    id: "",
    size: 0,
    url: "",
    name: "",
    type: "",
  });
  const { control, handleSubmit, setValue, setError } = useForm<{
    comment: string;
  }>({
    mode: "all",
  });

  useEffect(() => {
    setCommentText([]);
  }, []);

  const {
    data: detail,
    isLoading,
    isFetching,
    refetch,
  } = useTicketDetail(props.params);

  useEffect(() => {
    if (detail?.data?.logTime?.status === "running") {
      const pauseHistory = detail.data.logTime.pauseHistory;
      const lastPause = pauseHistory[pauseHistory.length - 1];
      const startTime = lastPause?.resumedAt ?? detail.data.logTime.startAt;
      const timeDiff =
        dateDiff(startTime, DateTime.now().toString(), "seconds") ?? 0;
      setTime(typeof timeDiff === "number" ? timeDiff * 1000 : 0);
      setIsTracking(true);
    } else if (detail?.data?.logTime?.status === "paused") {
      setTime(detail.data.logTime.durationInSeconds);
      setIsTracking(false);
    }

    if (detail?.data.company.type === "B2C") {
      setCustomerId(detail?.data?.customer.id || "");
      checkCompanyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isTracking && !isFetching) {
      intervalId = setInterval(
        () => setTime((prevTime) => prevTime + 1000),
        1000,
      );
    }
    return () => clearInterval(intervalId);
  }, [isTracking, isFetching]);

  const {
    data: comment,
    isLoading: isLoadingComment,
    refetch: refetchComments,
  } = useCommentList(props.params, pagination);

  useEffect(() => {
    var dataComment: ListCommentData[] = comment?.data.list ?? [];
    if (dataComment) {
      let reversed = dataComment.reverse();
      setCommentText(() => reversed);
      return;
    }
  }, [comment]);

  const checkCompanyData = () => {
    setTimeout(() => {
      checkCompany(
        {},
        {
          onSuccess: (data) => {
            setCustomerBalance(
              data.data.subscription.balance != null
                ? data.data.subscription.balance.time.remaining.total
                : 0,
            );
            checkConfig(
              {},
              {
                onSuccess: (value) => {
                  if (
                    data.data.subscription.balance != null &&
                    data.data.subscription.balance.time.remaining.total <
                      value.data.minimumCredit
                  ) {
                    setOpenAlert(true);
                    setAlertMessage(
                      "Your customer balance is low. Please inform your customer.",
                    );
                  } else if (data.data.subscription.balance == null) {
                    setOpenAlert(true);
                    setAlertMessage(
                      "Your customer don't have any subscription. Please inform your customer.",
                    );
                  }
                },
                onError: (e) => {
                  toast.error(e.data.message);
                },
              },
            );
          },
          onError: (e) => {
            toast.error(e.data.message);
          },
        },
      );
    }, 500);
  };

  const { mutate: pauseMutate, isPending: isPendingPause } = usePauseTime();

  const { mutate: resumeMutate, isPending: isPendingResume } = useResumeTime();

  const handleResume = () => {
    resumeMutate(
      {
        id: detail?.data?.id || "",
      },
      {
        onSuccess: () => {
          refetch();
          setTime(0);
        },

        onError: (e) => {
          toast.error(e.data.message);
          refetch();
          setTime(0);
        },
      },
    );
  };

  const handlePause = () => {
    pauseMutate(
      {
        id: detail?.data?.id || "",
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (e) => {
          toast.error(e.data.message);
          refetch();
        },
      },
    );
  };

  const handleGetAttachment = () => {
    getAttachment(
      {},
      {
        onSuccess: (data) => {
          setAttachment({
            id: data.data.id,
            size: data.data.size,
            url: data.data.url,
            name: data.data.name,
            type: data.data.type,
          });
          setOpen(true);
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (!e.target.files) return;

    var data = await Promise.all(
      Array.from(e.target.files).map((item) => {
        const file = item;

        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 2 MB`);
          return null;
        }

        return {
          file,
          url: URL.createObjectURL(file),
          size: file.size,
          fileName: `Attachment-${DateTime.now().toMillis().toString()}`,
          id: "",
          isUploaded: false,
        };
      }),
    );

    data = data.filter((item): item is FileList => item !== null);

    if (data.length > 0) {
      setFileList((prev) => [...prev, ...(data as FileList[])]);
      onUploadAttachment(data as FileList[]);
    }

    e.target.value = "";
  };

  const onUploadAttachment = (data: FileList[]) => {
    data.forEach((item) => {
      if (!item.isUploaded) {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("title", item.fileName);
        uploadAttachment(formData, {
          onSuccess: (data) => {
            toast.success("Attachment uploaded");
            setFileList((prev) =>
              prev.map((item) =>
                item.fileName === data.data.name
                  ? { ...item, isUploaded: true, id: data.data.id }
                  : item,
              ),
            );
          },
        });
      }
    });
  };

  const onLoadMore = () => {
    setPagination((prev) => ({ ...prev, limit: prev.limit + LIMIT_COMMENT }));
  };

  const onDeleteItem = (index: number) => {
    var list = [...fileList];
    list.splice(index, 1);
    setFileList(list);
  };

  const onSubmit = handleSubmit((data) => {
    if (data.comment === "") {
      toast.error("Comment cannot be empty");
      setError("comment", { message: "Comment cannot be empty" });
      return;
    }
    if (selectedStatus === "") {
      toast.error("Please select status");
      return;
    }
    let arr: string[] = [];
    if (fileList.length > 0) {
      arr = fileList.map((item) => item.id);
    }
    createComment(
      {
        ticketId: detail?.data.id,
        content: data.comment,
        attachIds: arr,
        status: selectedStatus,
      },
      {
        onSuccess: (data) => {
          setSelectedStatus("");
          setFileList([]);
          setCommentText(() => []);
          setPagination((prev) => ({
            ...prev,
            limit: pagination.limit + 1,
          }));
          setValue("comment", "");
          refetchComments();
          refetch();
          toast.success("Comment submitted");
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  });

  const onAddToMyTask = () => {
    assignToMe(
      {},
      {
        onSuccess: () => {
          toast.success("Successfully added to my task");
          refetch();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  };

  const dateDiff = (
    date?: string,
    endDate: string = DateTime.now().toString(),
    type: string = "diff",
  ) => {
    const now = endDate ? DateTime.fromISO(endDate) : DateTime.now();
    const created = DateTime.fromISO(date ?? now.toString());
    const diff = now
      .diff(created, ["second", "minutes", "hours", "days"])
      .toObject();

    if (type === "seconds") {
      return Math.floor(diff.seconds ?? 0);
    }

    if (type !== "diff") {
      return `${Math.floor(diff.hours ?? 0)}h : ${Math.floor(diff.minutes ?? 0)}m : ${Math.floor(diff.seconds ?? 0)}s`;
    }

    if ((diff.days ?? 0) > 2) {
      return created.toFormat("DDDD");
    } else if (diff.days) {
      return `${Math.floor(diff.days)} day(s) ago`;
    } else if (diff.hours) {
      return `${Math.floor(diff.hours)} hour(s) ago`;
    } else if (diff.minutes) {
      return `${Math.floor(diff.minutes)} minute(s) ago`;
    } else if (diff.seconds) {
      return `${Math.floor(diff.seconds)} second(s) ago`;
    }
    return "Just now";
  };

  const renderStatus = (status: string) => {
    let color = "";
    switch (status) {
      case "open":
        color = "bg-green-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      case "cancel":
        color = "bg-red-400";
        break;
      default:
        color = "bg-blue-500";
    }
    return (
      <Chip
        startContent={
          <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
        }
        className="capitalize"
        size="sm"
        variant="bordered"
      >
        {status.replace("_", " ")}
      </Chip>
    );
  };

  const data = useMemo(() => {
    if (detail?.data.status == "open") {
      return [
        {
          id: "open",
          name: "Open",
        },
        {
          id: "in_progress",
          name: "In Progress",
        },
      ];
    } else if (
      detail?.data.status == "in_progress" ||
      detail?.data.status == "resolve"
    ) {
      return [
        {
          id: "resolve",
          name: "Resolve",
        },
        {
          id: "in_progress",
          name: "In Progress",
        },
      ];
    } else if (detail?.data.status == "close") {
      return [
        {
          id: "close",
          name: "Close",
        },
      ];
    } else if (detail?.data.status == "cancel") {
      return [
        {
          id: "cancel",
          name: "Cancel",
        },
      ];
    }
  }, [detail]);

  const renderTime = useCallback(
    (props: { children: ReactNode }) => {
      const hours = Math.floor(Math.abs(time / 3600000));
      const minutes = Math.floor(Math.abs((time % 3600000) / 60000));
      const seconds = Math.floor(Math.abs((time % 60000) / 1000));
      const formatTime = (unit: number) => (unit < 10 ? `0${unit}` : unit);
      return (
        <div className="p-1 rounded-lg flex flex-col md:flex-row justify-between items-center w-full">
          <div className="flex items-center">
            <BiStopwatch />
            {isTracking ? (
              <p className="font-semibold text-md font-mono ml-3">{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
            ) : (
              <p className="font-semibold text-md font-mono ml-3">
                {secondsToHms(detail?.data.logTime.durationInSeconds ?? 0)}
              </p>
            )}
          </div>
          {props.children}
        </div>
      );
    },
    [time, detail?.data.logTime.durationInSeconds, isTracking],
  );

  if (isLoading) {
    return (
      <div className="w-full mx-auto mt-10 flex space-x-2">
        <Spinner size="sm" />
        <p>Loading...</p>
      </div>
    );
  }

  const renderStatusSelection = (status: Status) => {
    let color = "";
    switch (status.id) {
      case "open":
        color = "bg-green-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      case "cancel":
        color = "bg-red-400";
        break;
      default:
        color = "bg-blue-500";
    }
    return (
      <Fragment key={status.id}>
        <Chip
          onClick={() => {
            if (status.id == selectedStatus) {
              setSelectedStatus("");
              return;
            }
            setSelectedStatus(status.id);
          }}
          startContent={
            <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
          }
          endContent={
            status.id == selectedStatus && (
              <div className="ml-1 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
                <HiCheck className="h-3 w-3 text-white" />
              </div>
            )
          }
          className="capitalize"
          size="sm"
          variant="bordered"
        >
          <p
            className={`${status.id == selectedStatus ? "text-primary" : "text-white"}`}
          >
            {status.name}
          </p>
        </Chip>
      </Fragment>
    );
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          href="/tickets"
          onClick={() => router.back()}
        >
          <RiArrowLeftLine size={20} />
        </Button>
        <h1 className="font-semibold text-xl">Ticket Detail</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <Card shadow="sm">
            <CardHeader className="justify-between">
              <div className="flex gap-2 items-center">
                <Avatar isBordered src={detail?.data.product.image} />
                <div>{detail?.data.product.name}</div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="bg-slate-700 h-[560px] overflow-auto message-body relative">
              {detail?.data.company.type == "B2C" &&
                !detail.data.assignedToMe && (
                  <div className="absolute inset-0 bg-white opacity-50 z-10">
                    <BiLock
                      size={100}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                    />
                  </div>
                )}
              {isLoadingComment ? (
                <div className="w-full mx-auto flex justify-center items-center">
                  <Spinner size="sm" />
                </div>
              ) : (
                <>
                  {(comment?.data.totalPage ?? 0) > pagination.page && (
                    <div className="w-full mx-auto flex justify-center items-center">
                      <Button
                        onPress={() => {
                          onLoadMore();
                        }}
                        className="bg-white"
                      >
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-slate-700">
                            Load More Older Comment
                          </p>
                          <HiArrowUp size={15} className="text-blue-500" />
                        </div>
                      </Button>
                    </div>
                  )}
                </>
              )}
              {comment?.data.list.length == 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-white">
                  <p className="font-semibold">
                    You’re starting a new conversation
                  </p>
                  <p>Type your first message below.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4">
                  {commentText.map((item, i) => (
                    <>
                      {item.sender === "agent" ? (
                        <div className="flex flex-col items-end">
                          <div className="text-xs text-gray-400 mb-0.5">
                            {DateTime.fromISO(
                              item.createdAt ?? DateTime.now().toString(),
                            )
                              .toLocal()
                              .toFormat("dd LLL yyyy, HH:mm")}
                          </div>
                          <div className="max-w-[80%] bg-primary border border-gray-500 p-2 rounded-lg">
                            <div>{item.content}</div>
                            {item.attachments.length > 0 && (
                              <>
                                <Divider />
                                <div className="space-y-1 mt-1">
                                  {item.attachments.map((attachment) => (
                                    <div
                                      key={attachment.id}
                                      className="flex justify-start items-center p-1 space-x-2"
                                    >
                                      <p className="text-xs text-slate-600">
                                        {attachment.name}
                                      </p>
                                      <p className="text-[9px] text-slate-400">
                                        {attachment.size} Kb
                                      </p>
                                      <div
                                        onClick={() => {
                                          setSelectedAttachment(attachment.id);
                                          handleGetAttachment();
                                        }}
                                        role="button"
                                        className="text-success-600 text-xs font-semibold"
                                      >
                                        View
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start">
                          <div className="text-xs text-gray-400 mb-0.5">
                            {DateTime.fromISO(
                              item.createdAt ?? DateTime.now().toString(),
                            )
                              .toLocal()
                              .toFormat("dd LLL yyyy, HH:mm")}
                          </div>
                          <div className="max-w-[80%] bg-white border border-gray-500 p-2 rounded-lg">
                            <div>{item.content}</div>
                            {item.attachments.length > 0 && (
                              <>
                                <Divider />
                                <div className="space-y-1 mt-1">
                                  {item.attachments.map((attachment) => (
                                    <div
                                      key={attachment.id}
                                      className="flex justify-start items-center p-1 space-x-2"
                                    >
                                      <p className="text-xs text-slate-600">
                                        {attachment.name}
                                      </p>
                                      <p className="text-[9px] text-slate-400">
                                        {attachment.size} Kb
                                      </p>
                                      <div
                                        onClick={() => {
                                          setSelectedAttachment(attachment.id);
                                          handleGetAttachment();
                                        }}
                                        role="button"
                                        className="text-success-600 text-xs font-semibold"
                                      >
                                        View
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              )}

              <div className="sticky bg-slate-700 bottom-0 flex flex-col gap-4 mt-4">
                <input
                  accept="image/*,application/pdf, video/*"
                  multiple
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <form onSubmit={onSubmit}>
                  <Controller
                    name="comment"
                    rules={{
                      required: {
                        value: true,
                        message: "Comment cannot be empty",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Textarea
                        placeholder="Type your message here..."
                        errorMessage={error?.message}
                        isInvalid={invalid}
                        {...field}
                        endContent={
                          <div className="flex items-end h-full bottom-0 space-x-2">
                            <Button
                              aria-label="attachment"
                              isIconOnly
                              variant="bordered"
                              onClick={(event) => {
                                event.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="cursor-pointer border-primary"
                            >
                              <RiAttachment2
                                size={20}
                                className="text-primary"
                              />
                            </Button>
                            <Button
                              aria-label="send"
                              isIconOnly
                              type="submit"
                              className="cursor-pointer bg-primary"
                            >
                              <RiSendPlane2Line
                                size={20}
                                className="text-white"
                              />
                            </Button>
                          </div>
                        }
                      />
                    )}
                  />
                </form>

                <div className="flex flex-wrap justify-center bg-red gap-2">
                  {data?.map((status) => renderStatusSelection(status))}
                </div>

                {fileList.length > 0 && (
                  <div className="space-y-1 px-4 mb-2">
                    {fileList.map((item, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <div className="text-xs font-semibold">
                          {item.fileName}
                        </div>
                        <div className="text-xs text-default-500">
                          ({item.size}Kb)
                        </div>
                        {item.isUploaded ? (
                          <div
                            onClick={() => {
                              onDeleteItem(index);
                            }}
                          >
                            <HiTrash className="text-red-500" />
                          </div>
                        ) : (
                          <div className="text-xs text-default-500">
                            Uploading...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="p-4">
          <h3 className="text-center mb-4 font-semibold text-lg">
            Ticket Information
          </h3>

          {detail?.data.company.type !== "B2C" && (
            <div className="mb-4">
              <h6 className="mb-1 text-gray-500 text-sm">Category</h6>
              <p>{detail?.data.category?.name || ""}</p>
            </div>
          )}

          {detail?.data.company.type === "B2C" && (
            <div className="mb-4">
              <h6 className="mb-1 text-gray-500 text-sm">
                Credit Hour Remaining
              </h6>
              <p>{secondsToHms(customerBalance)}</p>
            </div>
          )}

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Subject</h6>
            <p>{detail?.data.subject}</p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Description</h6>
            <p className="text-justify">{detail?.data.content}</p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Ticket ID</h6>
            <p>{detail?.data.code}</p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Created On</h6>
            <p>
              {DateTime.fromISO(
                detail?.data.createdAt ?? DateTime.now().toString(),
              )
                .toLocal()
                .toFormat("dd LLL yyyy, HH:mm")}
            </p>
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Customer</h6>

            <div>
              <div className="rounded bg-slate-200 py-1 px-3 inline-flex gap-2 items-center">
                <span className="text-sm font-semibold">
                  {detail?.data.customer.name}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2">
            <p className="text-gray-500 text-xs font-light">Status</p>
            {renderStatus(detail?.data?.status ?? "open")}
          </div>

          <div className="mb-4">
            <h6 className="mb-1 text-gray-500 text-sm">Priority</h6>
            <p>{detail?.data.priority}</p>
          </div>
          <p>{}</p>

          {detail?.data.company.type == "B2C" && !detail.data.assignedToMe ? (
            <div className="w-full flex items-start justify-center">
              <Button
                color="primary"
                onPress={() => onAddToMyTask()}
                isLoading={isPending}
              >
                Add to my task
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-slate-200 p-2">
                {detail?.data.logTime.durationInSeconds != 0 &&
                  detail?.data.logTime.status == "running" && (
                    <p className="text-xs">
                      Total tracked time{" "}
                      <span className="font-semibold text-xs font-mono ml-3">
                        {secondsToHms(
                          detail?.data.logTime.durationInSeconds ?? 0,
                        )}
                      </span>
                    </p>
                  )}
                <div className="relative">
                  {detail?.data.logTime.status == "not_started" && (
                    <div className="flex items-center">
                      <BiStopwatch />
                      <p className="ml-1 text-sm">
                        Start tracking the time you spend on this ticket
                      </p>
                    </div>
                  )}
                  {["paused", "running"].includes(
                    detail?.data.logTime.status || "",
                  ) && (
                    <div className="flex w-full">
                      {renderTime({
                        children: (
                          <div className="flex gap-2.5">
                            <PauseResume
                              isPaused={
                                detail?.data?.logTime?.status === "paused"
                              }
                              ticketId={detail?.data?.id || ""}
                              durationTotal={
                                detail?.data?.logTime?.durationInSeconds || 0
                              }
                              isPending={isPendingPause || isPendingResume}
                              onPause={() => {
                                handlePause();
                              }}
                              onResume={() => {
                                handleResume();
                              }}
                              hidePauseResume={false}
                            />
                          </div>
                        ),
                      })}
                    </div>
                  )}
                  {detail?.data.logTime.status == "done" && (
                    <div className="p-3 rounded-lg flex flex-col md:flex-row justify-between items-center">
                      <p className="text-sm">
                        Total time tracked{" "}
                        <span className="font-semibold text-md font-mono ml-3">
                          {secondsToHms(
                            detail?.data.logTime.durationInSeconds ?? 0,
                          )}
                        </span>
                      </p>
                      <PauseResume
                        isPaused={false}
                        ticketId={detail?.data?.id || ""}
                        isPending={false}
                        durationTotal={detail?.data?.logTime?.durationInSeconds}
                        onPause={() => {}}
                        onResume={() => {}}
                        hidePauseResume={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5">
                {detail?.data.attachments &&
                  detail.data.attachments.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex items-center p-3 gap-2 rounded-md my-2 border-[1px] border-slate-200"
                    >
                      <p className="w-full text-sm">{item.name}</p>
                      <Button
                        onPress={() => {
                          setSelectedAttachment(item.id);
                          handleGetAttachment();
                        }}
                        variant="light"
                        size="sm"
                        color="primary"
                        className="ml-auto font-bold"
                      >
                        View
                      </Button>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
        <ImageViewModal
          isOpen={open}
          data={attachment}
          onClose={() => {
            setOpen(false);
          }}
        />
        <AlertCreditHourModal
          open={openAlert}
          setOpen={setOpenAlert}
          alertMessageL={alertMessage}
        />
      </div>
    </>
  );
}
