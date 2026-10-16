"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

import ClosedEye from "@/assets/icons/CloseEye";
import OpenEye from "@/assets/icons/OpenEye";
import LogoDevops from "@/assets/images/logo_devops.svg";
import LogoPrefeitura from "@/assets/images/logo_prefeitura.svg";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputMask } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import formSchema, { FormDataLogin } from "./schema";
import useView from "./view";
import BackgroundForm from "../BackgroundForm";
import { PERFIL_NOT_PERMISSION_ERROR_MESSAGE } from "@/const";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [hasError, setHasError] = useState<boolean>(false);

    // Guarda os valores anteriores para detectar mudanças reais
    const previousValues = useRef({ rf: "", password: "" });

    const form = useForm<FormDataLogin>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rf: "",
            password: "",
        },
        mode: "onChange",
    });

    const { onSubmit, isPending } = useView();

    // Watch para os campos RF e password
    const watchedFields = form.watch(["rf", "password"]);
    const [rf, password] = watchedFields;

    // Effect para esconder o alert quando qualquer campo for alterado
    useEffect(() => {
        if (hasError) {
            // Verifica se houve mudança real nos campos
            const rfChanged = rf !== previousValues.current.rf;
            const passwordChanged =
                password !== previousValues.current.password;

            if (rfChanged || (passwordChanged && password !== "")) {
                setErrorMessage(null);
                setHasError(false);
            }
        }

        // Atualiza os valores anteriores
        previousValues.current = { rf, password };
    }, [rf, password, hasError]);

    // Função personalizada para o submit
    const handleSubmit = (values: FormDataLogin) => {
        onSubmit(values, (errorMsg: string) => {
            setErrorMessage(errorMsg);
            setHasError(true);
            form.setValue("password", ""); // Limpa senha
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundForm />
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-[60px]">
                        <Image
                            src={LogoDevops}
                            alt="Logo AutoServiço"
                            className="w-[199.3474px] h-[34.1841px]"
                            loading="lazy"
                            fetchPriority="low"
                            width={199}
                            height={34}
                        />
                    </div>
                    <div className="bg-white rounded-sm shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
                        <div className="mb-8 text-left">
                            <h1 className="text-xl font-medium text-blue-900 mb-2">
                                Boas vindas ao Autosserviço!
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Confira as informações técnicas e dados de seu
                                sistema.
                            </p>
                        </div>
                        <div className="mb-8">
                            {errorMessage && (
                                <Alert
                                    variant="destructive"
                                    className="bg-[#ffe9e9] [&>svg]:size-6"
                                >
                                    <AlertCircleIcon />
                                    {errorMessage !==
                                        PERFIL_NOT_PERMISSION_ERROR_MESSAGE && (
                                            <AlertTitle className="font-bold text-[#111827]">
                                                Vamos tentar de novo?
                                            </AlertTitle>
                                        )}
                                    <AlertDescription>
                                        <p className="text-[#6b7280] !leading-4 -mt-1">
                                            {errorMessage}
                                        </p>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <Form {...form}>
                            <form
                                className="space-y-4 md:space-y-3"
                                onSubmit={form.handleSubmit(handleSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="rf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required font-semibold">
                                                Registro Funcional (RF)
                                            </FormLabel>
                                            <FormControl>
                                                <InputMask
                                                    {...field}
                                                    inputMode="numeric"
                                                    placeholder="Digite o seu RF..."
                                                    maskProps={{
                                                        mask: "99999999",
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="relative">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-5">
                                                <FormLabel className="required font-semibold">
                                                    Senha
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="Digite a sua senha..."
                                                        autoComplete="password"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Senha visível"
                                                : "Senha invisível."
                                        }
                                        className="text-[#282828] dark:text-white cursor-pointer absolute top-[2.9rem] right-[1rem]"
                                        onClick={() => {
                                            setShowPassword((prev) => !prev);
                                        }}
                                    >
                                        {showPassword ? (
                                            <OpenEye />
                                        ) : (
                                            <ClosedEye />
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        variant="default"
                                        className="w-full text-white font-medium mt-5 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={
                                            !form.formState.isValid || isPending
                                        }
                                    >
                                        Entrar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="flex justify-center mt-[53px]">
                        <Image
                            src={LogoPrefeitura}
                            alt="Logo Prefeitura de São Paulo"
                            className="w-[208px] h-[80px]"
                            loading="lazy"
                            fetchPriority="low"
                            width={208}
                            height={80}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
