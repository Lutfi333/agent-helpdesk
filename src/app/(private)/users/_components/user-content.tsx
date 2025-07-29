import { Button, Input, useDisclosure } from "@heroui/react";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import UserTable from "./user-table";
import ModalConfirmDelete from "@/components/ModalConfirmDelete";
import React from "react";

const UserContent: React.FC = () => {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();

  const [search, setSearch] = React.useState("");
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const onsubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const search = target.search;
    router.push(`${path}?${createQueryString("q", search.value)}`);
  };

  return (
    <>
      <div className="flex md:justify-between gap-4 items-end mb-4">
        <div>
          <h1 className="font-semibold text-xl mb-1">Agent User Management</h1>
          <p className="text-sm text-gray-500">
            Manage user who can acces the desk ticketing
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <form onSubmit={onsubmitSearch} className="flex justify-evenly">
            <Input
              id="search"
              variant="bordered"
              endContent={<RiSearchLine />}
              value={search}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSearch(target.value);
                if (target.value === "") {
                  router.push(`${path}?${createQueryString("q", "")}`);
                }
              }}
              placeholder="Search by Name"
            />
          </form>

          <Button
            className="flex-none"
            color="primary"
            endContent={<RiAddLine />}
            onPress={() => router.push("/users/add")}
          >
            Add New User
          </Button>
        </div>
      </div>

      <UserTable />
    </>
  );
};

export default UserContent;
