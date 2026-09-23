type Props = {
  readonly dataInicio: string;
  readonly dataFim: string;
  readonly onChangeDataInicio: (next: string) => void;
  readonly onChangeDataFim: (next: string) => void;
};

const DATE_INPUT_CLASSNAME =
  "h-9 rounded-md border border-[#D8D8D8] bg-white px-3 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]";

const DATE_LABEL_CLASSNAME = "text-xs font-bold text-[#6B7280]";

export default function IntervaloDeDatasInput({
  dataInicio,
  dataFim,
  onChangeDataInicio,
  onChangeDataFim,
}: Props) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className={DATE_LABEL_CLASSNAME}>De:</span>
        <input
          type="date"
          value={dataInicio}
          onChange={(event) => onChangeDataInicio(event.target.value)}
          className={DATE_INPUT_CLASSNAME}
          aria-label="Data inicial"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className={DATE_LABEL_CLASSNAME}>Até:</span>
        <input
          type="date"
          value={dataFim}
          onChange={(event) => onChangeDataFim(event.target.value)}
          className={DATE_INPUT_CLASSNAME}
          aria-label="Data final"
        />
      </div>
    </>
  );
}
