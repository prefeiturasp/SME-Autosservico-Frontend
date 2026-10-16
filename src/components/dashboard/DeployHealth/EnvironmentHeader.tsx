"use client";

import { cn } from "@/lib/utils";
import {
    DEPLOY_ENVIRONMENTS,
    type DeployEnvironment,
} from "@/types/deployEnvironment";
import { useMemo, useState } from "react";
import EnvironmentSwitcher from "./EnvironmentSwitcher";

type Props = {
    readonly defaultEnvironment?: DeployEnvironment;
    readonly value?: DeployEnvironment;
    readonly onChange?: (next: DeployEnvironment) => void;
    readonly className?: string;
};

export default function EnvironmentHeader({
    defaultEnvironment = "producao",
    value,
    onChange,
    className,
}: Props) {
    const [internalValue, setInternalValue] =
        useState<DeployEnvironment>(defaultEnvironment);
    const selected = value ?? internalValue;

    const current = useMemo(
        () =>
            DEPLOY_ENVIRONMENTS.find((env) => env.value === selected) ??
            DEPLOY_ENVIRONMENTS[0],
        [selected],
    );

    const handleChange = (next: DeployEnvironment) => {
        if (value === undefined) {
            setInternalValue(next);
        }
        onChange?.(next);
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between px-6 py-4",
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <span
                    className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        current.dotClassName,
                    )}
                    aria-hidden
                />
                <h3 className="text-base font-bold text-[#111827]">
                    {current.label} - {current.branch}
                </h3>
            </div>
            <EnvironmentSwitcher
                id="onboarding-environment-switcher"
                value={selected}
                onChange={handleChange}
            />
        </div>
    );
}
