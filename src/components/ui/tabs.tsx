"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

type TabsProps = {
  readonly defaultValue: string;
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly className?: string;
  readonly children: React.ReactNode;
};

function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [value, handleValueChange]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = {
  readonly className?: string;
  readonly children: React.ReactNode;
};

function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex w-fit items-end gap-10 border-b border-[#E5E7EB] pr-10",
        className
      )}
    >
      {children}
    </div>
  );
}

type TabsTriggerProps = {
  readonly value: string;
  readonly className?: string;
  readonly children: React.ReactNode;
};

function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(value)}
      className={cn(
        "relative cursor-pointer pb-3 text-base font-extrabold transition-colors",
        isActive ? "text-[#0F172A]" : "text-[#94A3B8] hover:text-[#475569]",
        className
      )}
    >
      {children}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 rounded-t-md bg-[#2563EB]"
        />
      )}
    </button>
  );
}

type TabsContentProps = {
  readonly value: string;
  readonly className?: string;
  readonly children: React.ReactNode;
};

function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      key={value}
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-1 duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
