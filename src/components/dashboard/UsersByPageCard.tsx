"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, RotateCcw } from "lucide-react";
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

type SortKey = "path" | "currentUsers" | "averageUsers";
type SortDirection = "asc" | "desc";
type AriaSort = "ascending" | "descending" | "none";
type SortState = { key: SortKey; direction: SortDirection } | null;

const ALL_PAGES_VALUE = "all";
const INITIAL_VISIBLE_ROWS = 5;
const BAR_COLOR = "#1F3D73";

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

function formatCount(value: number) {
  return ptBrFormatter.format(value);
}

function compareEntries(
  a: UsersByPageEntry,
  b: UsersByPageEntry,
  key: SortKey
): number {
  if (key === "path") return a.path.localeCompare(b.path, "pt-BR");
  return a[key] - b[key];
}

function toggleSort(current: SortState, key: SortKey): SortState {
  if (!current || current.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}

function getSortIcon(direction: SortDirection | null) {
  if (direction === "asc") return ArrowUp;
  if (direction === "desc") return ArrowDown;
  return ArrowUpDown;
}

function getAriaSort(direction: SortDirection | null): AriaSort {
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return "none";
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
    <tr
      data-testid={`users-by-page-row-${index}`}
      className="border-b border-[#E5E7EB] text-sm"
    >
      <td className="py-3 pr-4 align-middle text-[#111827]">{index}</td>
      <td className="py-3 pr-4 align-middle truncate">{entry.path}</td>
      <td className="py-3 pr-4 align-middle">
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
      </td>
      <td className="py-3 pr-4 align-middle font-semibold">
        {formatCount(entry.currentUsers)}
      </td>
      <td className="py-3 align-middle text-muted-foreground">
        {formatCount(entry.averageUsers)}
      </td>
    </tr>
  );
}

type SortableHeaderProps = {
  readonly label: string;
  readonly sortKey: SortKey;
  readonly sort: SortState;
  readonly onSort: (key: SortKey) => void;
  readonly width: string;
};

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  width,
}: SortableHeaderProps) {
  const isActive = sort?.key === sortKey;
  const direction = isActive ? sort.direction : null;
  const Icon = getSortIcon(direction);

  return (
    <th
      scope="col"
      aria-sort={getAriaSort(direction)}
      className={cn("pb-2 pr-4 text-left", width)}
    >
      <button
        type="button"
        data-testid={`users-by-page-sort-${sortKey}`}
        onClick={() => onSort(sortKey)}
        className={cn(
          "flex items-center gap-1 text-left transition-colors hover:text-[#1F3D73]",
          isActive && "font-semibold"
        )}
      >
        <span>{label}</span>
        <Icon
          className={cn("h-3.5 w-3.5", !isActive && "opacity-40")}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}

type TableHeaderProps = {
  readonly sort: SortState;
  readonly onSort: (key: SortKey) => void;
};

function TableHeader({ sort, onSort }: TableHeaderProps) {
  return (
    <thead>
      <tr className="border-b text-sm text-[#111827]">
        <th scope="col" className="w-6 pb-2" />
        <SortableHeader
          label="Descrição"
          sortKey="path"
          sort={sort}
          onSort={onSort}
          width="w-auto"
        />
        <th scope="col" className="w-[120px] pb-2 pr-4 text-left">
          Acesso
        </th>
        <SortableHeader
          label="Agora"
          sortKey="currentUsers"
          sort={sort}
          onSort={onSort}
          width="w-24"
        />
        <SortableHeader
          label="Média"
          sortKey="averageUsers"
          sort={sort}
          onSort={onSort}
          width="w-24"
        />
      </tr>
    </thead>
  );
}

export default function UsersByPageCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUsersByPage({
    systemName: systemName ?? "",
  });

  const [selectedPath, setSelectedPath] = useState<string>(ALL_PAGES_VALUE);
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<SortState>(null);

  const filteredPages = useMemo(() => {
    if (!data) return [];
    if (selectedPath === ALL_PAGES_VALUE) return data.pages;
    return data.pages.filter((entry) => entry.path === selectedPath);
  }, [data, selectedPath]);

  const sortedPages = useMemo(() => {
    if (!sort) return filteredPages;
    const copy = [...filteredPages];
    copy.sort((a, b) => {
      const result = compareEntries(a, b, sort.key);
      return sort.direction === "asc" ? result : -result;
    });
    return copy;
  }, [filteredPages, sort]);

  const visiblePages = expanded
    ? sortedPages
    : sortedPages.slice(0, INITIAL_VISIBLE_ROWS);

  const canExpand = sortedPages.length > INITIAL_VISIBLE_ROWS;

  const maxCurrent = useMemo(
    () =>
      sortedPages.reduce(
        (acc, entry) => (entry.currentUsers > acc ? entry.currentUsers : acc),
        0
      ),
    [sortedPages]
  );

  const handleSort = (key: SortKey) => {
    setSort((current) => toggleSort(current, key));
  };

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
        <table className="w-full table-fixed">
          <TableHeader sort={sort} onSort={handleSort} />
          <tbody>
            {visiblePages.map((entry, idx) => (
              <PageRow
                key={entry.path}
                index={idx + 1}
                entry={entry}
                maxCurrent={maxCurrent}
              />
            ))}
          </tbody>
        </table>
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
