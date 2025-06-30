import { z } from "zod";

const formSchema = z.object({
    rf: z
        .string()
        .min(1, "RF é obrigatório")
        .max(8, "Formato de RF inválido"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
});

export type FormDataLogin = z.infer<typeof formSchema>;

export default formSchema;
