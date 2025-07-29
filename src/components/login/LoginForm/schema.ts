import { z } from "zod";

import {
  RF_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  RF_FORMAT_ERROR_MESSAGE
} from "@/const";

const formSchema = z.object({
    rf: z
        .string()
        .min(1, RF_ERROR_MESSAGE)
        .max(8, RF_FORMAT_ERROR_MESSAGE),
    password: z
        .string()
        .min(1, PASSWORD_ERROR_MESSAGE)
});

export type FormDataLogin = z.infer<typeof formSchema>;

export default formSchema;
