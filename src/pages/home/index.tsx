import AppTable from "../../component/table";
import { Button, Modal } from "@mantine/core";
import Form from "./form";

import Search from "./search";

import useHome from "./useHome";
import { useMemo } from "react";

export default function Home() {
  const {
    values: { columns, list, user, open },
    methods: { onSearchHandler, toggleModel, onSubmitHandler },
  } = useHome();

  const title = useMemo(() => user ? 'Edit User' : 'Add User',[user])

  return (
    <div className="flex-1 relative">
      <div className="p-6 pt-4">
        <Search onSearch={onSearchHandler} />
      </div>
      <Button
        className="absolute bottom-4 right-4 rounded-full"
        onClick={toggleModel}
      >
        Add
      </Button>
      <div className="px-8">
        <AppTable columns={columns} data={list} footer />
      </div>
      <Modal opened={open} onClose={toggleModel} title={title}>
        <Form values={user} onSubmit={onSubmitHandler} />
      </Modal>
    </div>
  );
}
