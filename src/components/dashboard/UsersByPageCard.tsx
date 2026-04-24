"use client";

import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUsersByPage } from "@/hooks/useUsersByPage";
import type { UsersByPageEntry } from "@/types/usersByPage";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ALL_PAGES_VALUE = "all";
const INITIAL_VISIBLE_ROWS = 5;
const BAR_COLOR = "#1F3D73";

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

function formatCount(value: number) {
  return ptBrFormatter.format(value);
}

type PageRowProps = {
  readonly index: number;
  readonly entry: UsersByPageEntry;
  readonly maxCurrent: number;
};

function PageRow({ index, entry, maxCurrent }: PageRowProps) {
  const fillPercentage =
    maxCurrent > 0
      ? Math.max(0, Math.min(100, (entry.currentUsers / maxCurrent) * 100))
      : 0;

  return (
    <div
      data-testid={`users-by-page-row-${index}`}
      className="grid grid-cols-[24px_1fr_120px_96px_96px] items-center gap-4 py-3 text-sm"
    >
      <span className="text-[#111827]">{index}</span>
      <span className="truncate">{entry.path}</span>
      <div
        className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]"
        aria-label={`Acesso: ${Math.round(fillPercentage)}%`}
      >
        <div
          data-testid={`users-by-page-bar-fill-${index}`}
          className="h-full rounded-full"
          style={{ width: `${fillPercentage}%`, backgroundColor: BAR_COLOR }}
        />
      </div>
      <span className="font-semibold">{formatCount(entry.currentUsers)}</span>
      <span className="text-muted-foreground">
        {formatCount(entry.averageUsers)}
      </span>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="grid grid-cols-[24px_1fr_120px_96px_96px] items-center gap-4 border-b pb-2 text-sm text-[#111827]">
      <span />
      <span>Descrição</span>
      <span>Acesso</span>
      <span>Agora</span>
      <span>Média</span>
    </div>
  );
}

export default function UsersByPageCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUsersByPage({
    systemName: systemName ?? "",
  });

  const [selectedPath, setSelectedPath] = useState<string>(ALL_PAGES_VALUE);
  const [expanded, setExpanded] = useState(false);

  const filteredPages = useMemo(() => {
    if (!data) return [];
    if (selectedPath === ALL_PAGES_VALUE) return data.pages;
    return data.pages.filter((entry) => entry.path === selectedPath);
  }, [data, selectedPath]);

  const visiblePages = expanded
    ? filteredPages
    : filteredPages.slice(0, INITIAL_VISIBLE_ROWS);

  const canExpand = filteredPages.length > INITIAL_VISIBLE_ROWS;

  const maxCurrent = useMemo(
    () =>
      filteredPages.reduce(
        (acc, entry) => (entry.currentUsers > acc ? entry.currentUsers : acc),
        0
      ),
    [filteredPages]
  );

  const content = () => {
    if (!systemName) {
      return (
        <div className="text-sm text-muted-foreground">Selecione um projeto</div>
      );
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar os usuários por página.
          </div>
          <Button
            onClick={() => refetch()}
            variant="secondary"
            size="sm"
            className="mt-3"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <>
        <TableHeader />
        <div className="divide-y divide-[#E5E7EB]">
          {visiblePages.map((entry, idx) => (
            <PageRow
              key={entry.path}
              index={idx + 1}
              entry={entry}
              maxCurrent={maxCurrent}
            />
          ))}
        </div>
        {canExpand && (
          <div className="flex justify-center border-t pt-3">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-2 text-sm font-medium text-[#1F3D73] hover:underline"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expanded && "rotate-180"
                )}
                aria-hidden="true"
              />
              {expanded ? "Ver menos páginas" : "Ver mais páginas"}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-1 px-4">
        <CardTitle className="text-base font-bold">Usuários por página</CardTitle>
        <Select value={selectedPath} onValueChange={setSelectedPath}>
          <SelectTrigger className="h-9 w-[200px]" aria-label="Filtrar por página">
            <SelectValue placeholder="Todas as páginas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_PAGES_VALUE}>Todas as páginas</SelectItem>
            {data?.pages.map((entry) => (
              <SelectItem key={entry.path} value={entry.path}>
                {entry.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
