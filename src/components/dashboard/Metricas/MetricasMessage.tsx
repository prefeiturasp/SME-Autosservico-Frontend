type Props = {
    readonly children: React.ReactNode;
};

export default function MetricasMessage({ children }: Props) {
    return <div className="text-sm text-muted-foreground">{children}</div>;
}
