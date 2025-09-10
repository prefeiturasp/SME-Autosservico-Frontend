"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDashboardStore from "@/states/dashboard";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Sistema } from "./schema";
import { getSistemasPorSquad } from "./getSistemasPorSquad";

export function SelectSistemas() {
    const activeItem = useDashboardStore((state) => state.activeItem);
    const setActiveProject = useDashboardStore(
        (state) => state.setActiveProject
    );

    const sistemas: Sistema[] = useMemo(
        () => (activeItem ? getSistemasPorSquad(activeItem.title) : []),
        [activeItem]
    );

    const [selectedValue, setSelectedValue] = useState("");

    const handleSelectChange = useCallback(
        (value: string) => {
            const selectedSistema = sistemas.find(
                (sistema) => sistema.id === value
            );
            if (selectedSistema) {
                setActiveProject({
                    ...selectedSistema,
                    zabbixQueryFrontend: selectedSistema.zabbixQueryFrontend,
                    zabbixQueryBackend: selectedSistema.zabbixQueryBackend,
                    zabbixQueryFilasRabbitMQ: selectedSistema.zabbixQueryFilasRabbitMQ,
                });
            }
        },
        [setActiveProject, sistemas]
    );

    // ✅ Atualiza apenas quando a Squad (activeItem) muda
    useEffect(() => {
        if (activeItem && sistemas.length > 0) {
            setSelectedValue(sistemas[0].id);
            handleSelectChange(sistemas[0].id);
        } else {
            setSelectedValue(""); // Reseta quando não houver sistemas
        }
    }, [activeItem, handleSelectChange, sistemas, setActiveProject]);

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
                                        className="focus:bg-[#3b82f6] focus:text-white !focus:ring-0 !focus-visible:ring-0 focus:outline-none"
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
