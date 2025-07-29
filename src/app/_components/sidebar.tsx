"use client";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { FaChartSimple } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { Image } from "@heroui/react";
import { LuCat, LuUser, LuUserCog } from "react-icons/lu";
import { MdChecklist } from "react-icons/md";
import { useAuthMe } from "@/services/auth";
import { BiCategory } from "react-icons/bi";

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  const activeMenu = (path: string) => {
    if (path === "/") return pathname == path;
    else {
      if (pathname.indexOf(path) === 0 && path != "/") return true;
      else return false;
    }
  };

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "white",
          borderRight: "0px",
          zIndex: 0,
        },
      }}
      className="h-screen"
    >
      <div className="px-4">
        <div
          className="rounded-xl mb-5
        "
        >
          <Image
            width={150}
            alt="slabs logo"
            src="/assets/solutionlabs-logo.png"
          />
        </div>
      </div>
      <Menu
        className="px-2"
        menuItemStyles={{
          button: ({ active }) => {
            return {
              color: active ? "#FBF9F1" : "#64748B",
              backgroundColor: active ? "#77C045" : undefined,
              borderRadius: "8px",
              marginBottom: "8px",
              marginTop: "8px",
              paddingLeft: "5px",
              paddingRight: "5px",
              "&:hover": {
                color: "#FBF9F1",
                backgroundColor: "#758694",
                borderRadius: "8px",
                marginBottom: "8px",
                marginTop: "8px",
                paddingLeft: "5px",
                paddingRight: "5px",
              },
            };
          },
        }}
      >
        <MenuItem
          href="/"
          className="rounded-md"
          active={activeMenu("/")}
          icon={<FaChartSimple />}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          href="/tickets"
          className="rounded-md"
          active={activeMenu("/tickets")}
          icon={<FaTicketAlt />}
        >
          Tickets
        </MenuItem>
        {user?.company.type === "B2C" && (
          <>
            <MenuItem
              href="/task"
              className="rounded-md"
              active={activeMenu("/task")}
              icon={<MdChecklist />}
            >
              My Task
            </MenuItem>
            <MenuItem
              href="/customer-user"
              className="rounded-md"
              active={activeMenu("/customer-user")}
              icon={<LuUser />}
            >
              Customer
            </MenuItem>
          </>
        )}
        {user?.company.type !== "B2C" && (
          <MenuItem
            href="/customers"
            className="rounded-md"
            active={activeMenu("/customers")}
            icon={<LuUser />}
          >
            Customer
          </MenuItem>
        )}
        {user?.role === "admin" && (
          <>
            <MenuItem
              href="/users"
              className="rounded-md"
              active={activeMenu("/users")}
              icon={<LuUserCog />}
            >
              Agent User Management
            </MenuItem>
            {user?.company.type !== "B2C" && (
              <MenuItem
                href="/category"
                className="rounded-md"
                active={activeMenu("/category")}
                icon={<BiCategory />}
              >
                Category Management
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </Sidebar>
  );
}
