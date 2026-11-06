import React from "react";

export const selectNativo = {
    Select: ({
        children,
        value,
        onValueChange,
    }: Readonly<{
        children: React.ReactNode;
        value: string;
        onValueChange: (value: string) => void;
    }>) => (
        <select
            data-testid="select-native"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
        >
            {children}
        </select>
    ),
    SelectTrigger: () => null,
    SelectValue: () => null,
    SelectContent: ({ children }: Readonly<{ children: React.ReactNode }>) => (
        <>{children}</>
    ),
    SelectGroup: ({ children }: Readonly<{ children: React.ReactNode }>) => (
        <>{children}</>
    ),
    SelectLabel: () => null,
    SelectItem: ({
        value,
        children,
    }: Readonly<{ value: string; children: React.ReactNode }>) => (
        <option value={value}>{children}</option>
    ),
};
