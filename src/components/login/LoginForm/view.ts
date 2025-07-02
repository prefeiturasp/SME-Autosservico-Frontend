import { useTransition } from "react";
import { FormDataLogin } from "./schema";
import { authenticate } from "@/lib/actions";

export default function useLoginView() {
    const [isPending, startTransition] = useTransition();

    async function onSubmit(
        values: FormDataLogin,
        setErrorMessage: (msg: string | null) => void
    ) {
        setErrorMessage(null); // Limpa mensagens de erro anteriores

        startTransition(async () => {
            const formData = new FormData();
            formData.append("rf", values.rf);
            formData.append("password", values.password);

            const error = await authenticate(undefined, formData);

            if (error) {
                setErrorMessage(error);
            }
        });
    }

    return { onSubmit, isPending };
}
