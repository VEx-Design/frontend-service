import { createContext, useContext, useState } from "react";
import { FormulaFStatus } from "../libs/ClassConfig/types/FreeSpace";

interface ConfigFreeSContextValue {
  formulars: FormulaFStatus[];
  setFormulars: (formulars: FormulaFStatus[]) => void;
  currentIdFormula: { paramId: string } | undefined;
  setCurrentIdFormula: (
    currentIdFormula: { paramId: string } | undefined
  ) => void;
  formulaAction: FormulaAction;
}

interface FormulaAction {
  applyFormula: (formula: { paramId: string }) => void;
  cancelFormula: (formula: { paramId: string }) => void;
}

const ConfigFreeSContext = createContext<ConfigFreeSContextValue | undefined>(
  undefined
);

interface ConfigFreeSProviderProps {
  children: React.ReactNode;
}

export const ConfigFreeSProvider = ({ children }: ConfigFreeSProviderProps) => {
  const [formulars, setFormulars] = useState<FormulaFStatus[]>([]);
  const [currentIdFormula, setCurrentIdFormula] = useState<
    | {
        paramId: string;
      }
    | undefined
  >(undefined);

  const formulaAction: FormulaAction = {
    applyFormula: (formula: { paramId: string }) => {
      console.log("applyFormula", formula);
    },
    cancelFormula: (formula: { paramId: string }) => {
      console.log("cancelFormula", formula);
    },
  };

  return (
    <ConfigFreeSContext.Provider
      value={{
        formulars,
        setFormulars,
        currentIdFormula,
        setCurrentIdFormula,
        formulaAction,
      }}
    >
      {children}
    </ConfigFreeSContext.Provider>
  );
};

export const useConfigFreeS = () => {
  const context = useContext(ConfigFreeSContext);
  if (context === undefined) {
    throw new Error("useConfigFreeS must be used within a ConfigFreeSProvider");
  }
  return context;
};
