import React, { createContext, useContext } from "react";

type Ponto = Record<string, unknown>;

const DadosContext = createContext<Ponto[]>([]);

type ChartProps = {
    readonly data: Ponto[];
    readonly children?: React.ReactNode;
};

function Chart(testId: string) {
    function MockChart({ data, children }: ChartProps) {
        return (
            <DadosContext.Provider value={data}>
                <div data-testid={testId} data-pontos={data.length}>
                    {children}
                </div>
            </DadosContext.Provider>
        );
    }
    MockChart.displayName = `MockChart(${testId})`;
    return MockChart;
}

function Passthrough({ children }: { readonly children?: React.ReactNode }) {
    return <>{children}</>;
}

function Nada() {
    return null;
}

function MockTooltip({ content }: { readonly content?: React.ReactElement }) {
    const dados = useContext(DadosContext);
    if (!content || dados.length === 0) return null;
    return (
        <div data-testid="chart-tooltip">
            {React.cloneElement(content, {
                active: true,
                payload: [{ payload: dados[0] }],
            } as never)}
        </div>
    );
}

function MockBar({
    dataKey,
    fill,
    children,
}: {
    readonly dataKey: string;
    readonly fill?: string;
    readonly children?: React.ReactNode;
}) {
    return (
        <div data-testid={`bar-${dataKey}`} data-fill={fill}>
            {children}
        </div>
    );
}

function MockLabelList({
    dataKey,
    formatter,
}: {
    readonly dataKey: string;
    readonly formatter?: (valor: unknown) => string;
}) {
    const dados = useContext(DadosContext);
    return (
        <>
            {dados.map((ponto, indice) => (
                <span
                    key={`${dataKey}-${indice}`}
                    data-testid={`label-${dataKey}`}
                >
                    {formatter
                        ? formatter(ponto[dataKey])
                        : String(ponto[dataKey])}
                </span>
            ))}
        </>
    );
}

function MockLine({ dot }: { readonly dot?: React.ReactElement }) {
    const dados = useContext(DadosContext);
    return (
        <svg data-testid="line">
            {dot &&
                dados.map((ponto, indice) =>
                    React.cloneElement(dot, {
                        key: `dot-${indice}`,
                        cx: indice * 10,
                        cy: 10,
                        payload: ponto,
                    } as never),
                )}
        </svg>
    );
}

function MockYAxis({
    tickFormatter,
}: {
    readonly tickFormatter?: (valor: number) => string;
}) {
    return tickFormatter ? (
        <span data-testid="y-tick">{tickFormatter(6000)}</span>
    ) : null;
}

export const rechartsFalso = {
    ResponsiveContainer: Passthrough,
    BarChart: Chart("bar-chart"),
    LineChart: Chart("line-chart"),
    Bar: MockBar,
    Line: MockLine,
    LabelList: MockLabelList,
    Tooltip: MockTooltip,
    XAxis: Nada,
    YAxis: MockYAxis,
    CartesianGrid: Nada,
};
