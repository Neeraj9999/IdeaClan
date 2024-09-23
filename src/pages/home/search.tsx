import { SyntheticEvent, useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Input } from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

interface Prop {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export default function Search({
  onSearch,
  placeholder = "Search for Email or Name",
}: Prop) {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 200);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(event: SyntheticEvent<HTMLInputElement>) =>
        setValue(event.currentTarget.value)
      }
      rightSectionPointerEvents="all"
      mt="md"
      leftSection={<FaSearch aria-label="Search" />}
      rightSection={
        <IoCloseSharp aria-label="Clear" onClick={() => setValue("")} />
      }
    />
  );
}
