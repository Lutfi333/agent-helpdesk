"use client";
import React from "react";
import {
  Navbar,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { HiUserCircle } from "react-icons/hi";
import Cookies from "js-cookie";
import { AUTH_KEY, USER } from "@/constants/auth";
import { useAuthMe } from "@/services/auth";

export default function TopNavbar() {
  const { data, isFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  return (
    <Navbar
      classNames={{
        wrapper: "h-20 px-5 max-w-[100%] border-b",
      }}
    >
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div role="button" className="flex">
              {!isFetching && (
                <div className="mr-2">
                  <p className="text-sm">{user?.name ?? ""}</p>
                  <p className="text-xs text-gray-500 font-light">
                    {user?.email ?? ""}
                  </p>
                </div>
              )}
              {!isFetching && (
                <Avatar showFallback src={user?.profilePicture?.url} />
              )}
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              onPress={() => {
                window.location.href = "/setting";
              }}
              key="setting"
            >
              Setting
            </DropdownItem>
            <DropdownItem
              onPress={() => {
                Cookies.remove(AUTH_KEY);
                Cookies.remove(USER);
                window.location.href = "/login";
              }}
              key="logout"
              color="danger"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
