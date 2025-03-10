/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useUploadAttachment } from "@/services/attachment";
import { useAuthMe } from "@/services/auth";
import { useDetailCompany } from "@/services/company";
import {
  useUpdateProfile,
  useChangeDomain,
  useChangePassword,
  useConfig,
  useUploadProfile,
} from "@/services/setting";
import {
  Avatar,
  Card,
  CardBody,
  Button,
  Textarea,
  Input,
  Switch,
  cn,
} from "@heroui/react";
import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeOff, HiPencil } from "react-icons/hi";
import EditProfileModal from "./edit-profile-modal";

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export default function SettingContent() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isEditProfile, setEditProfile] = useState(false);
  const [isEditPassword, setEditPassword] = useState(false);
  const [isEditDomain, setEditDomain] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [valueBio, setValueBio] = useState("");
  const [valueName, setValueName] = useState("");
  const [valueDomain, setValueDomain] = useState("");
  const [visibleOld, setVisibleOld] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const { control, handleSubmit, setValue } = useForm<{
    isCustom: boolean;
    subdomain: string;
    fullUrl: string;
  }>({
    mode: "all",
  });

  const {
    control: passControl,
    handleSubmit: handleSubmitPass,
    setValue: setValuePass,
    setError: setErrorPass,
  } = useForm<{
    oldPassword: string;
    newPassword: string;
  }>({
    mode: "all",
  });

  const {
    control: profileControl,
    handleSubmit: handleSubmitProfile,
    setValue: setValueProfile,
  } = useForm<{
    name: string;
    attachment: string;
  }>({
    mode: "all",
  });

  const { data, isFetching, refetch } = useAuthMe();
  const { data: company, refetch: refetchCompany } = useDetailCompany();
  const { mutate: updateProfile } = useUpdateProfile();
  const { data: config } = useConfig();
  const { mutate: updateDomain } = useChangeDomain();
  const { mutate: updatePassword } = useChangePassword();
  const { mutate: uploadAttachment } = useUploadProfile();

  useEffect(() => {
    if (data?.data) {
      setValueBio(data?.data?.bio);
      setValueName(data?.data?.name);
      setAttachment({
        id: data?.data?.profilePicture.id,
        name: data?.data?.profilePicture.name,
        size: data?.data?.profilePicture.size,
        type: data?.data?.profilePicture.type,
        url: data?.data?.profilePicture.url,
      });
    }
  }, [data]);

  useEffect(() => {
    if (company?.data) {
      setIsCustom(company?.data?.settings.domain?.isCustom);
      setValue(
        "fullUrl",
        isCustom
          ? company?.data?.settings.domain?.fullUrl
          : company?.data?.settings.domain?.subdomain,
      );
    }
  }, [company, setValue]);

  const handleSaveProfile = handleSubmitProfile(async (data) => {
    updateProfile(
      {
        bio: valueBio,
        name: data.name,
        attachId: attachment?.id,
      },
      {
        onSuccess: () => {
          toast.success("Success to update profile");
          setValueBio("");
          setValueName("");
          setEditProfile(false);
          refetch();
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      },
    );
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileData = e.target.files[0];
      const formData = new FormData();
      formData.append("file", fileData);
      formData.append("title", fileData.name);
      uploadAttachment(formData, {
        onSuccess: (data) => {
          toast.success("Success to upload attachment");
          setValueProfile("attachment", data.data.name);
          setAttachment({
            id: data.data.id,
            name: data.data.name,
            size: data.data.size,
            type: data.data.type,
            url: data.data.url,
          });
        },
        onError: () => {
          toast.error("Failed to upload attachment");
        },
      });
    }
  };

  const onSubmit = handleSubmit((payload) => {
    updateDomain(
      {
        isCustom: isCustom,
        subdomain: payload.fullUrl,
        fullUrl: payload.fullUrl,
      },
      {
        onSuccess: () => {
          toast.success("Success to update domain");
          setEditDomain(false);
          refetchCompany();
        },
        onError: () => {
          toast.error("Failed to update domain");
        },
      },
    );
  });

  const onSubmitPass = handleSubmitPass((payload) => {
    updatePassword(
      {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Success to update password");
          setValuePass("oldPassword", "");
          setValuePass("newPassword", "");
          setEditPassword(false);
        },
        onError: (e) => {
          toast.error(e.data.message);
          if (e.data.validation) {
            if (e.data.validation.oldPassword) {
              setErrorPass("oldPassword", {
                message: e.data.validation.oldPassword,
              });
            }
            if (e.data.validation.newPassword) {
              setErrorPass("newPassword", {
                message: e.data.validation.newPassword,
              });
            }
          }
        },
      },
    );
  });

  const toggleVisiblePass = (type: string) => {
    type == "new" ? setVisibleNew(!visibleNew) : setVisibleOld(!visibleOld);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <Card>
        <CardBody className="p-4">
          <h1 className="font-semibold text-xl">Profile Setting</h1>
          <>
            <div className="flex items-center mt-2">
              {!isFetching && (
                <div className="w-20 h-20">
                  <Avatar
                    className="w-20 h-20 text-large"
                    src={data?.data?.profilePicture.url ?? ""}
                  />
                </div>
              )}
              <div className="w-full mx-5">
                <p>{data?.data?.name ?? ""}</p>
                {/* <p className="text-gray-500">Agent Solutionlab Indonesia</p> */}
              </div>
              <Button
                onPress={() => {
                  setValueBio(data?.data?.bio ?? "");
                  setValueProfile("name", data?.data?.name ?? "");
                  setValueProfile(
                    "attachment",
                    data?.data?.profilePicture.name ?? "",
                  );
                  setEditProfile(true);
                }}
              >
                <HiPencil size={20} />
                Edit
              </Button>
            </div>
            <p className="text-slate-400 mt-5">Bio</p>
            <div className="max-w-2/4 border border-gray-500 rounded-md p-3">
              <p>{data?.data?.bio != "" ? data?.data?.bio : "No Bio Yet"}</p>
            </div>
          </>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-4">
          <h1 className="font-semibold text-xl">Account Setting</h1>
          {isEditPassword ? (
            <form onSubmit={onSubmitPass}>
              <div className="flex flex-col gap-3">
                <Controller
                  name="oldPassword"
                  control={passControl}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Input
                      id="oldPassword"
                      label="Old Password"
                      type={visibleOld ? "text" : "password"}
                      labelPlacement="outside"
                      variant="bordered"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className="w-4/12"
                      placeholder=""
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => toggleVisiblePass("old")}
                        >
                          {visibleOld ? (
                            <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                          ) : (
                            <HiOutlineEye className="h-5 w-5 text-default-500" />
                          )}
                        </button>
                      }
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="newPassword"
                  control={passControl}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Input
                      id="newPassword"
                      label="New Password"
                      type={visibleNew ? "text" : "password"}
                      labelPlacement="outside"
                      variant="bordered"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      className="w-4/12"
                      placeholder=""
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => toggleVisiblePass("new")}
                        >
                          {visibleNew ? (
                            <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                          ) : (
                            <HiOutlineEye className="h-5 w-5 text-default-500" />
                          )}
                        </button>
                      }
                      {...field}
                    />
                  )}
                />
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-promary text-primary"
                    onPress={() => {
                      setEditPassword(false);
                      setValuePass("oldPassword", "");
                      setValuePass("newPassword", "");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-start mt-2 gap-3">
              <div>
                <p className="text-slate-400 text-md">Email</p>
                <p className="text-gray-500">{data?.data.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-md">Password</p>
                <Button
                  onPress={() => setEditPassword(true)}
                  size="sm"
                  className="bg-primary text-white"
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-4">
          <h1 className="font-semibold text-xl">Domain Setting</h1>
          {isEditDomain ? (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-3">
                <Switch
                  checked={isCustom}
                  onValueChange={(val) => {
                    setIsCustom(val);
                    val
                      ? setValueDomain(
                          company?.data.settings.domain.fullUrl ?? "",
                        )
                      : setValueDomain(
                          company?.data.settings.domain.subdomain ?? "",
                        );
                  }}
                >
                  Custom Domain
                </Switch>
                <div className="flex">
                  <Controller
                    control={control}
                    name="fullUrl"
                    rules={{
                      required: { value: true, message: "Domain is required" },
                      pattern: {
                        value: isCustom
                          ? /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
                          : /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/,
                        message: isCustom
                          ? "Invalid domain"
                          : "Subdomain must be alphanumeric",
                      },
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        id="fullUrl"
                        label={isCustom ? "Custom Domain" : "Subdomain"}
                        type="text"
                        labelPlacement="outside"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        className="w-8/12"
                        classNames={{
                          inputWrapper: "pr-0",
                        }}
                        placeholder=""
                        endContent={
                          !isCustom && (
                            <div className="bg-slate-300 h-full flex items-center px-3 rounded-r-lg flex-shrink-0">
                              <p className="text-gray-500 break-before-avoid">
                                {config?.data.mainDomain}
                              </p>
                            </div>
                          )
                        }
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-promary text-primary"
                    onPress={() => setEditDomain(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center mt-2 gap-3">
              <div>
                <p className="text-gray-500">
                  {company?.data.settings.domain.fullUrl}
                </p>
              </div>
              {data?.data.role === "admin" && (
                <div>
                  {data?.data.company.type !== "B2C" && (
                    <Button
                      onPress={() => {
                        setValueDomain(
                          company?.data?.settings.domain.isCustom
                            ? company?.data?.settings.domain.fullUrl ?? ""
                            : company?.data?.settings.domain.subdomain ?? "",
                        );
                        setEditDomain(true);
                      }}
                      size="sm"
                      className="bg-primary text-white"
                    >
                      Change Domain
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
      <EditProfileModal
        open={isEditProfile}
        setOpen={setEditProfile}
        profileControl={profileControl}
        handleSaveProfile={handleSaveProfile}
        handleFileChange={handleFileChange}
        inputFileRef={inputFileRef}
        valueBio={valueBio}
        setValueBio={setValueBio}
        selectedAvatar={attachment || null}
      />
    </div>
  );
}
