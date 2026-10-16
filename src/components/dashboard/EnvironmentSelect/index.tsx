import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    readonly value: "prod" | "homolog";
    readonly onChange: (value: "prod" | "homolog") => void;
};

export function EnvironmentSelect({ value, onChange }: Props) {
    return (
        <Select
            value={value}
            onValueChange={(v) => onChange(v === "homolog" ? "homolog" : "prod")}
        >
            <SelectTrigger
                size="sm"
                className="w-auto rounded-full border-transparent bg-slate-100 px-3 text-xs font-medium text-slate-700 shadow-none hover:bg-slate-200 gap-1"
                aria-label="Selecionar ambiente"
            >
                <SelectValue placeholder="Ambiente" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    value="prod"
                    className="focus:bg-[#3b82f6] focus:text-white"
                >
                    Produção
                </SelectItem>
                <SelectItem
                    value="homolog"
                    className="focus:bg-[#3b82f6] focus:text-white"
                >
                    Homologação
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
