"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Input,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { AUTH_KEY, USER } from "@/constants/auth";
import { Env } from "@/config/env";
import { AuthLoginPayload, useAuthLogin } from "@/services/auth";

export default function LoginCard() {
  const router = useRouter();
  const { control, handleSubmit, setValue } = useForm<AuthLoginPayload>({
    mode: "all",
  });

  const [isVisiblePass, setIsVisiblePass] = useState<boolean>(false);

  const { isPending, mutate, mutateAsync } = useAuthLogin();

  const toggleVisibilityPass = () => {
    setIsVisiblePass(!isVisiblePass);
  };

  useEffect(() => {
    setValue("email", "");
    setValue("password", "");
  }, [setValue]);

  const onSubmit = handleSubmit((payload) => {
    mutate(payload, {
      onSuccess: (data) => {
        toast.success("Login success");
        Cookies.set(AUTH_KEY, data.data.token);
        Cookies.set(USER, JSON.stringify(data.data.user));
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.data.message);
      },
    });
  });

  return (<>
    <div className="flex justify-center w-full mb-4">
      <Image
        className="max-w-full"
        width={300}
        alt="Solutionlabs logo"
        src="/assets/logo-landscape.png"
      />
    </div>
    <Card className="w-full md:w-[420px] rounded-lg p-5 mb-8">
      <CardHeader className="justify-center">
        <p className="text-xl font-semibold">Login as Agent</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Controller
              name="email"
              rules={{
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email",
                },
              }}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  type="email"
                  id="email"
                  data-testid="email"
                  placeholder="Email"
                  size="lg"
                  radius="md"
                  variant="bordered"
                  className="border-gray-400"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="password"
              rules={{
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                required: {
                  value: true,
                  message: "Password is required",
                },
              }}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  type={isVisiblePass ? "text" : "password"}
                  id="password"
                  data-testid="password"
                  placeholder="Password"
                  size="lg"
                  radius="md"
                  variant="bordered"
                  isInvalid={invalid}
                  className="border-gray-400"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityPass}
                    >
                      {isVisiblePass ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-default-500" />
                      )}
                    </button>
                  }
                  errorMessage={error?.message}
                  {...field}
                />
              )}
            />
          </div>
          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="w-full bg-primary text-white hover:bg-gray-600"
            data-testid="submit"
          >
            Login
          </Button>
        </form>
      </CardBody>
    </Card>
    <div className="text-center text-lg w-full">&copy; 2024 Solutionlab</div>
  </>);
}
