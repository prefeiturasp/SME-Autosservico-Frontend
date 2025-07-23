// src/components/dashboard/SelectSistemas/index.tsx
"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import useView from "./view";
import { Sistema } from "./schema"; // Importando o tipo do schema

export function SelectSistemas() {
    const { useHandleSelectChange } = useView();

    // Usando o tipo Sistema do schema.ts
    const sistemas: Sistema[] = [
        { id: "1", nome: "Portal SME" },
        { id: "2", nome: "Intranet" },
    ];

    return (
        <div className="flex flex-col pb-2">
            <h2 className="font-bold text-xl pb-3">Sistema</h2>
            <p className="pb-2">
                Selecione um sistema para visualizar as informações
            </p>
            <div className="w-full pb-3">
                <Select onValueChange={useHandleSelectChange} defaultValue="1">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                        {sistemas.map((sistema) => (
                            <SelectItem key={sistema.id} value={sistema.id}>
                                {sistema.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
