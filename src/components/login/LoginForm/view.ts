import { useTransition } from "react";
import { FormDataLogin } from "./schema";
import { authenticate } from "@/lib/actions";

export default function useLoginView() {
    const [isPending, startTransition] = useTransition();

    async function onSubmit(
        values: FormDataLogin,
        onError: (errorMsg: string) => void
    ) {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("rf", values.rf);
            formData.append("password", values.password);

            const error = await authenticate(undefined, formData);

            if (error) {
               onError(error); // Chama callback quando há erro
            }
        });
    }

    return { onSubmit, isPending };
}
