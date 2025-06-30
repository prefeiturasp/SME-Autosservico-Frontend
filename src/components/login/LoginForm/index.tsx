"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import ClosedEye from "@/assets/icons/CloseEye";
import OpenEye from "@/assets/icons/OpenEye";

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

import formSchema, { FormDataLogin } from "./schema";
import useView from "./view";
import BackgroundForm from "../BackgroundForm";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<FormDataLogin>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rf: "",
            password: "",
        },
        mode: "onChange",
    });

    const { onSubmit } = useView();

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundForm />
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-sm shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
                        <div className="mb-8 text-left">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Boas vindas ao Autoserviço!
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Confira as informações da saúde do seu sistema e
                                tenha mais autonomia em suas atividades diárias.
                            </p>
                        </div>

                        <Form {...form}>
                            <form
                                className="space-y-4 md:space-y-3"
                                onSubmit={form.handleSubmit((values) =>
                                    onSubmit(values, setErrorMessage)
                                )} // Passando setErrorMessage para onSubmit
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

                                {errorMessage && (
                                    <div className="text-red-600 text-sm font-medium text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Link esqueceu senha */}
                                <div className="text-right">
                                    <button
                                        type="button"
                                        className="text-sm text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                        Esqueceu sua senha?
                                    </button>
                                </div>

                                <div>
                                    <Button
                                        variant="default"
                                        className="w-full text-white font-medium mt-5 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={!form.formState.isValid}
                                    >
                                        Entrar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
