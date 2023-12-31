import { RouterOutputs } from "@/utils/api";
import { Accordion } from "../ui/accordion";
import { VehicleAccordionItem } from "./VehicleAccordionItem";

type VehicleAccordionProps = {
  movimentacoes: NonNullable<
    RouterOutputs["incidents"]["getOne"]
  >["OcorrenciaMovimentacao"];
};

export const VehicleAccordion = ({ movimentacoes }: VehicleAccordionProps) => {
  return (
    <Accordion className="flex-1" type="single" collapsible>
      {movimentacoes.map((movimentacao) => (
        <VehicleAccordionItem movimentacao={movimentacao} />
      ))}
    </Accordion>
  );
};
