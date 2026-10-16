import { cn } from "@/lib/utils";
import {
    DEPLOY_ENVIRONMENTS,
    type DeployEnvironment,
} from "@/types/deployEnvironment";

type Props = {
    readonly value: DeployEnvironment;
    readonly onChange: (next: DeployEnvironment) => void;
    readonly className?: string;
    readonly name?: string;
    readonly id?: string;
};

export default function EnvironmentSwitcher({
    value,
    onChange,
    className,
    name = "deploy-environment",
    id,
}: Props) {
    return (
        <fieldset
            id={id}
            className={cn(
                "inline-flex items-stretch overflow-hidden rounded-lg border border-[#1E3A8A] bg-white",
                className,
            )}
        >
            <legend className="sr-only">Selecionar ambiente</legend>
            {DEPLOY_ENVIRONMENTS.map((env, index) => {
                const isSelected = env.value === value;
                return (
                    <label
                        key={env.value}
                        className={cn(
                            "inline-flex cursor-pointer items-center gap-2 px-6 py-2 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:ring-inset",
                            index > 0 && "border-l border-[#1E3A8A]",
                            isSelected
                                ? "bg-[#1E3A8A] text-white"
                                : "bg-white text-[#1E3A8A] hover:bg-gray-50",
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={env.value}
                            checked={isSelected}
                            onChange={() => onChange(env.value)}
                            className="sr-only"
                        />
                        <span
                            className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                env.dotClassName,
                            )}
                            aria-hidden
                        />
                        {env.label}
                    </label>
                );
            })}
        </fieldset>
    );
}
