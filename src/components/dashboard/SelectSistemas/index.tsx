"use client";
import { useEffect, useMemo, useState } from "react";
import useDashboardStore from "@/states/dashboard";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import useView from "./view";
import { Sistema } from "./schema";
import { getSistemasPorSquad } from "./getSistemasPorSquad";

export function SelectSistemas() {
    const { handleSelectChange } = useView();
    const activeItem = useDashboardStore((state) => state.activeItem);

    const sistemas: Sistema[] = useMemo(
        () => (activeItem ? getSistemasPorSquad(activeItem.title) : []),
        [activeItem]
    );

    const [selectedValue, setSelectedValue] = useState("");

    // ✅ Atualiza apenas quando a Squad (activeItem) muda
    useEffect(() => {
        if (activeItem && sistemas.length > 0) {
            setSelectedValue(sistemas[0].id);
            handleSelectChange(sistemas[0].id);
        } else {
            setSelectedValue(""); // Reseta quando não houver sistemas
        }
    }, [activeItem, handleSelectChange, sistemas]);

    if (!activeItem) return null;

    return (
        <div className="bg-background px-6 py-4">
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="font-bold text-xl pb-3">Sistema</h2>
                    <p className="pb-2">
                        Selecione um sistema para visualizar as informações
                    </p>
                    <div className="w-full pb-3">
                        <Select
                            value={selectedValue}
                            onValueChange={(value) => {
                                setSelectedValue(value);
                                handleSelectChange(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {sistemas.map((sistema) => (
                                    <SelectItem
                                        key={sistema.id}
                                        value={sistema.id}
                                    >
                                        {sistema.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
