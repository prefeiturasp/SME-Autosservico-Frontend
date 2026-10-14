"use client";

import type { Dispatch, SetStateAction } from "react";
import type { SigEscolaOpcoes } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { ALL_UES_VALUE } from "@/types/ueOption";
import DreSelect from "./DreSelect";
import FiltrarPorSwitcher from "./FiltrarPorSwitcher";
import IntervaloDeDatasInput from "./IntervaloDeDatasInput";
import PeriodoLetivoSelect from "./PeriodoLetivoSelect";
import UeSelect from "./UeSelect";

type Props = {
  readonly value: SigEscolaFiltros;
  readonly onChange: Dispatch<SetStateAction<SigEscolaFiltros>>;
  // Opções reais vindas do contrato: períodos do PTRF e UEs da DRE.
  readonly opcoes?: SigEscolaOpcoes;
  readonly className?: string;
};

const LABEL_CLASSNAME = "text-xs font-bold text-[#6B7280]";

export default function SigEscolaFiltrosBar({
  value,
  onChange,
  opcoes,
  className,
}: Props) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex flex-col gap-2">
          <span className={LABEL_CLASSNAME}>Filtrar por</span>
          <div className="flex items-center gap-3">
            <FiltrarPorSwitcher
              value={value.modo}
              onChange={(modo) => onChange((prev) => ({ ...prev, modo }))}
            />
            {value.modo === "periodo" && (
              <PeriodoLetivoSelect
                value={value.periodo || opcoes?.periodo || ""}
                options={opcoes?.periodos ?? []}
                onChange={(periodo) =>
                  onChange((prev) => ({ ...prev, periodo }))
                }
              />
            )}
          </div>
        </div>

        {value.modo === "intervalo" && (
          <IntervaloDeDatasInput
            dataInicio={value.dataInicio}
            dataFim={value.dataFim}
            onChangeDataInicio={(dataInicio) =>
              onChange((prev) => ({ ...prev, dataInicio }))
            }
            onChangeDataFim={(dataFim) =>
              onChange((prev) => ({ ...prev, dataFim }))
            }
          />
        )}

        <div className="flex flex-col gap-2">
          <span className={LABEL_CLASSNAME}>DRE</span>
          <DreSelect
            value={value.dre}
            onChange={(dre) =>
              // A UE escolhida pertence à DRE anterior: volta para "Todas".
              onChange((prev) => ({ ...prev, dre, ue: ALL_UES_VALUE }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={LABEL_CLASSNAME}>UE</span>
          <UeSelect
            value={value.ue}
            options={opcoes?.unidades ?? []}
            onChange={(ue) => onChange((prev) => ({ ...prev, ue }))}
          />
        </div>
      </div>
    </div>
  );
}
