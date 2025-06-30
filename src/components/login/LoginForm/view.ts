import { FormDataLogin } from "./schema";
import { authenticate } from "@/lib/actions";

export default function useView() {
    async function onSubmit(
        values: FormDataLogin,
        setErrorMessage: (msg: string | null) => void
    ) {
        const formData = new FormData();
        formData.append("rf", values.rf);
        formData.append("password", values.password);

        const error = await authenticate(undefined, formData);

        if (error) {
            if (typeof error === "string") {
                setErrorMessage(error); // agora passa a mensagem diretamente
            } else {
                setErrorMessage("Ocorreu um erro desconhecido."); // fallback para erro desconhecido
            }
        } else {
            setErrorMessage(null); // limpa mensagem se login for bem-sucedido
        }
    }

    return { onSubmit };
}
