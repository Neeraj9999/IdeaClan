import { v4 as uuidv4 } from "uuid";
import { FormValues, User } from "../pages/home/form/form.interface";
export function createUser(values: FormValues): User {
  return {
    uid: uuidv4(),
    ...values,
  };
}
