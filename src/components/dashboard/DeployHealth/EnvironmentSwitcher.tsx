import { cn } from "@/lib/utils";
import {
  DEPLOY_ENVIRONMENTS,
  type DeployEnvironment,
} from "@/types/deployEnvironment";

type Props = {
  readonly value: DeployEnvironment;
  readonly onChange: (next: DeployEnvironment) => void;
  readonly className?: string;
};

export default function EnvironmentSwitcher({ value, onChange, className }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Selecionar ambiente"
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-lg border border-[#1E3A8A] bg-white",
        className,
      )}
    >
      {DEPLOY_ENVIRONMENTS.map((env, index) => {
        const isSelected = env.value === value;
        return (
          <button
            key={env.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(env.value)}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2 text-sm font-bold transition-colors",
              index > 0 && "border-l-2 border-[#1E3A8A]",
              isSelected
                ? "bg-[#1E3A8A] text-white"
                : "bg-white text-[#1E3A8A] hover:bg-gray-50",
            )}
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", env.dotClassName)} aria-hidden />
            {env.label}
          </button>
        );
      })}
    </div>
  );
}
