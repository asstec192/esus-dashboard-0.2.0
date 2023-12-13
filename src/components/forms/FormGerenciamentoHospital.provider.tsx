import { useHospitlManagerForm } from "@/hooks/useHospitalManagerForm";
import { RouterOutputs } from "@/utils/api";
import { ReactNode, createContext, useContext } from "react";

export type HospitalManager = ReturnType<typeof useHospitlManagerForm>;

type ContextProps = {
  manager: HospitalManager;
};

type ProviderProps = {
  hospitalId: number;
  ultimoRelatorio: RouterOutputs["hospitalManager"]["obterRelatorioHospitalar"];
  children: ReactNode;
};

const GerenciamentoHospitalContext = createContext({} as ContextProps);

export const useHospitalManager = () =>
  useContext(GerenciamentoHospitalContext);

export const GerenciamentoHospitalProvider = ({
  children,
  hospitalId,
  ultimoRelatorio,
}: ProviderProps) => {
  const manager = useHospitlManagerForm(hospitalId, ultimoRelatorio);
  return (
    <GerenciamentoHospitalContext.Provider
      value={{
        manager,
      }}
    >
      {children}
    </GerenciamentoHospitalContext.Provider>
  );
};
