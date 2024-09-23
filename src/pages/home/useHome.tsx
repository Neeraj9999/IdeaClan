import { useCallback, useMemo, useState } from "react";
import { FormValues, SubmitHandler, User } from "./form/form.interface";
import { useLocalStorage } from "@mantine/hooks";
import { createColumnHelper } from "@tanstack/react-table";
import { orderBy } from "lodash";
import { createUser } from "../../utils";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";

import { format } from "date-fns";
import { ActionIcon, Menu, Pill, rem } from "@mantine/core";

const columnHelper = createColumnHelper<User>();

type sortType = "asc" | "desc" | null;

type SortBy = {
  [K in keyof User]: {
    type: sortType;
  };
};

export default function useHome() {
  const [user, setUser] = useState<FormValues | User | null>(null);
  const [open, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useLocalStorage({ key: "data", defaultValue: [] });
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy | null>(null);

  const list = useMemo(() => {
    const filteredList = data.filter((dbUser: User) => {
      return (
        dbUser.name.includes(search.trim()) ||
        dbUser.email.includes(search.trim())
      );
    });
    if (sortBy) {
      const sortingProperties = Object.keys(sortBy)
        .map((key: string) => sortBy?.[key as keyof User]?.type && key)
        .filter((a) => a);
      const sortingOrder = Object.keys(sortBy)
        .map((key: string) => sortBy?.[key as keyof User]?.type)
        .filter((a) => a) as any;
      return orderBy(filteredList, sortingProperties, sortingOrder);
    }
    return filteredList;
  }, [data, search, sortBy]);
  const toggleModel = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (user) {
      setUser(null);
    }
  }, [user]);
  const reset = useCallback(() => {
    toggleModel();
    setUser(null);
  }, [toggleModel]);

  const deleteHandler = useCallback(
    (uid: string) => {
      setData(data.filter((dbUser: User) => dbUser.uid !== uid));
    },
    [data, setData]
  );

  const onSubmitHandler = useCallback(
    (values: SubmitHandler) => {
      if (user) {
        const index = data.findIndex(
          (dbUser: User) => dbUser.uid === (user as User).uid
        );
        if (index > -1) {
          data[index] = values as never;
          setData([...data]);
        }
      } else {
        setData([createUser(values as FormValues) as never, ...data]);
      }
      reset();
    },
    [data, reset, setData, user]
  );
  const sortData = useCallback((key: string, sType: sortType) => {
    setSortBy((prev: SortBy | null) => {
      const old = prev || {};
      const newType =
        sType === "asc" ? "desc" : sType === "desc" ? null : "asc";
      return {
        ...old,
        [key]: {
          type: newType,
        },
      } as SortBy;
    });
  }, []);

  const sortIcon = useCallback((sType: sortType) => {
    switch (sType) {
      case "asc":
        return <FaSortDown />;
      case "desc":
        return <FaSortUp />;
      default:
        return <FaSort />;
    }
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("uid", {
        header: () => <span>UID</span>,
        cell: (info) => <i>{info.getValue()}</i>,
      }),
      columnHelper.accessor("name", {
        header: () => {
          const sType = sortBy?.name?.type || null;
          return (
            <div
              className="flex items-center"
              onClick={() => sortData("name", sType as sortType)}
            >
              <span>Name</span>
              {sortIcon(sType as sortType)}
            </div>
          );
        },
        cell: (info) => <i>{info.getValue()}</i>,
      }),
      columnHelper.accessor("email", {
        header: () => {
          const sType = sortBy?.email?.type || null;
          return (
            <div
              className="flex items-center"
              onClick={() => sortData("email", sType as sortType)}
            >
              <span>Email</span>
              {sortIcon(sType as sortType)}
            </div>
          );
        },
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("dob", {
        header: () => <span>DOB</span>,
        cell: (info) => {
          if (!info.renderValue()) {
            return "-";
          }
          return format(info.renderValue()!, "dd-MM-yyyy");
        },
      }),
      columnHelper.accessor("isActive", {
        header: () => <span>DOB</span>,
        cell: (info) => {
          const isActive =
            info.renderValue() === "true" ? "Active" : "InActive";
          return (
            <Pill
              size="xs"
              bg={info.renderValue() === "true" ? "green" : "red"}
            >
              {isActive}
            </Pill>
          );
        },
      }),
      columnHelper.accessor("gender", {
        header: () => <span>Gender</span>,
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("age", {
        header: "Age",
        cell: (info) => info.renderValue(),
        footer: (info) => {
          const total = info.table.getRowModel().rows.reduce((sum, row) => {
            return sum + (row as any).getValue("age") || 0;
          }, 0);
          return total;
        },
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor(() => "rowAction", {
        id: "rowAction",
        cell: (info) => {
          return (
            <Menu shadow="md" width="max-content" trigger="click-hover">
              <Menu.Target>
                <ActionIcon variant="default" aria-label="Menu">
                  <SlOptionsVertical style={{ width: "70%", height: "70%" }} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    toggleModel();
                    setUser(info.cell.row.original);
                  }}
                  leftSection={
                    <MdEdit style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={() => deleteHandler(info.cell.row.original.uid)}
                  leftSection={
                    <MdDelete
                      style={{ width: rem(14), height: rem(14), color: "red" }}
                    />
                  }
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          );
        },
        header: () => <span>Action</span>,
      }),
    ],
    [
      sortBy?.name?.type,
      sortBy?.email?.type,
      sortIcon,
      sortData,
      toggleModel,
      deleteHandler,
    ]
  ) as any;

  const onSearchHandler = useCallback((value: string) => {
    setSearch(value);
  }, []);
  return {
    values: {
      user,
      open,
      data,
      search,
      sortBy,
      list,
      columns,
    },
    methods: {
      setUser,
      setIsOpen,
      setData,
      setSearch,
      setSortBy,
      toggleModel,
      reset,
      deleteHandler,
      onSubmitHandler,
      sortData,
      sortIcon,
      onSearchHandler,
    },
  };
}
