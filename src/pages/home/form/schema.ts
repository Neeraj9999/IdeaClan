import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "required"),
  email: z.string().email("invalid").min(1, "required"),
  dob: z.date().max(new Date(), "invalid"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "required" }),
  }),
  age: z.number().min(1, {
    message: "reqired",
  }),
  country: z.string().min(1, "required"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits")
    .min(1, "required"),
  isActive: z.string(),
});
