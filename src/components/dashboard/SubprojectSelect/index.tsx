import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";

type Props = {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly subprojects: JenkinsSubproject[];
};

export function SubprojectSelect({ value, onChange, subprojects }: Props) {
    return (
        <div className="mb-4">
            <div className="text-sm font-semibold text-[#111827] mb-2">Projeto</div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    size="sm"
                    className="w-full"
                    aria-label="Selecionar projeto"
                >
                    <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                    {subprojects.map((s) => (
                        <SelectItem
                            key={s.key}
                            value={s.key}
                            className="focus:bg-[#3b82f6] focus:text-white"
                        >
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
