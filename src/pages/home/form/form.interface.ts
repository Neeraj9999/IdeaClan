import { z } from "zod";
import { formSchema } from "./schema";
export type FormValues = z.infer<typeof formSchema>;
export interface Props {
  values?: FormValues | null;
  onSubmit?: (newValues: FormValues) => void;
}

export interface User extends FormValues {
  uid: string;
}
export interface SubmitHandler extends Omit<User, "uid"> {
  uid?: string;
}
