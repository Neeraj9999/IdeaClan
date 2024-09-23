import { useForm } from "@mantine/form";
import {
  NumberInput,
  TextInput,
  Button,
  Select,
  Group,
  Radio,
} from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { DatePickerInput } from "@mantine/dates";
import { FormValues, Props } from "./form.interface";
import { formSchema } from "./schema";
import { useMemo } from "react";

export default function Form({ values, onSubmit }: Props) {
  const initialValues = useMemo(() => {
    if (values) {
      if (values?.dob) {
        values.dob = new Date(values.dob);
      }
      return values;
    }
    return {} as FormValues;
  }, [values]);
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: zodResolver(formSchema),
  });

  const onSubmitHandler = (newValues: FormValues) => {
    onSubmit?.(newValues);
  };

  return (
    <form onSubmit={form.onSubmit(onSubmitHandler)}>
      <TextInput
        label="Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
        placeholder="Enter Name"
      />
      <TextInput
        label="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
        placeholder="Enter Email"
      />
      <NumberInput
        label="Age"
        key={form.key("age")}
        {...form.getInputProps("age")}
        placeholder="Enter Age"
      />
      <DatePickerInput
        label="Birth Date"
        key={form.key("dob")}
        {...form.getInputProps("dob")}
        placeholder="Enter DOB"
        maxDate={new Date()}
      />

      <Select
        label="Gender"
        key={form.key("gender")}
        {...form.getInputProps("gender")}
        placeholder="Select Gender"
        data={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
      />
      <TextInput
        label="Country"
        key={form.key("country")}
        {...form.getInputProps("country")}
        placeholder="Enter Country"
      />
      <TextInput
        label="Phone Number"
        key={form.key("phoneNumber")}
        {...form.getInputProps("phoneNumber")}
        placeholder="Enter Phone Number"
      />
      <Radio.Group
        label="Status"
        key={form.key("isActive")}
        {...form.getInputProps("isActive")}
      >
        <Radio value="true" label="Active" />
        <Radio value="false" label="Inactive" />
      </Radio.Group>

      <Group mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
