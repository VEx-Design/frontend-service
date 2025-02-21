import { createContext, useContext, useEffect, useState } from "react";
import {
  FormulaFSId,
  FormulaFStatus,
  VariableFreeS,
} from "../libs/ClassConfig/types/FreeSpace";
import deleteVariable from "../libs/ClassConfig/FeatureFreeSpace/deleteVariable";
import setStream from "../libs/ClassConfig/FeatureFreeSpace/setStream";
import addVariable from "../libs/ClassConfig/FeatureFreeSpace/addVariable";
import getFormula from "../libs/ClassConfig/FeatureFreeSpace/getFormula";
import { useConfig } from "./ConfigContext";
import setFormula from "../libs/ClassConfig/FeatureFreeSpace/setFormula";
import { useProject } from "./ProjectContext";
import getFormulaFreeSpace from "../libs/ClassConfig/getFormulaFreeSpace";

type InputPosition = {
  index: number;
  position: number;
};

interface ConfigFreeSContextValue {
  formulars: FormulaFStatus[];
  setFormulars: (formulars: FormulaFStatus[]) => void;
  currentIdFormula: FormulaFSId | undefined;
  setCurrentIdFormula: (currentIdFormula: FormulaFSId | undefined) => void;
  setCurrentInputPosition: (inputPosition: InputPosition | undefined) => void;
  indexTofocus: number | undefined;
  setIndexTofocus: (index: number | undefined) => void;
  freeSpaceAction: FreeSpaceAction;
  formulaAction: FormulaAction;
}

interface FreeSpaceAction {
  getFormular: (formulaId: FormulaFSId) => FormulaFStatus | undefined;
  setFormular: (newFormular: FormulaFStatus) => void;
}

interface FormulaAction {
  setStream: (stream: string) => void;
  addVariable: (newVariable: VariableFreeS) => void;
  deleteVariable: () => void;
  applyFormula: (formulaId: FormulaFSId) => void;
  cancelFormula: (formulaId: FormulaFSId) => void;
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
    FormulaFSId | undefined
  >(undefined);
  const [currentInputPosition, setCurrentInputPosition] = useState<
    InputPosition | undefined
  >(undefined);
  const [indexTofocus, setIndexTofocus] = useState<number | undefined>(
    undefined
  );

  const { configAction } = useProject();
  const { currentConfigFreeS, setCurrentConfigFreeS } = useConfig();

  useEffect(() => {
    if (currentConfigFreeS) {
      setFormulars(
        currentConfigFreeS.formulas.map((f) => ({
          formula: f,
          isEdited: false,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConfigFreeS?.id]);

  const freeSpaceAction: FreeSpaceAction = {
    getFormular: (formulaId: FormulaFSId) => getFormula(formulars, formulaId),
    setFormular: (newFormular: FormulaFStatus) => {
      if (currentConfigFreeS) {
        const newFreeSpace = setFormula(currentConfigFreeS, newFormular);
        setCurrentConfigFreeS(newFreeSpace);
        configAction.editFreeSpace(newFreeSpace);
      }
    },
  };

  const formulaAction: FormulaAction = {
    setStream: (stream: string) => {
      const newFormulars = setStream(
        formulars,
        currentIdFormula!,
        stream,
        currentInputPosition!.index
      );
      setFormulars(newFormulars);
    },
    addVariable: (newVariable: VariableFreeS) => {
      const newFormulars = addVariable(
        formulars,
        currentIdFormula!,
        currentInputPosition!.index,
        currentInputPosition!.position,
        newVariable
      );
      setFormulars(newFormulars);
      setIndexTofocus(currentInputPosition!.index + 1);
      setCurrentInputPosition({
        index: currentInputPosition!.index + 1,
        position: 0,
      });
    },
    deleteVariable: () => {
      const newFormulars = deleteVariable(
        formulars,
        currentIdFormula!,
        currentInputPosition!.index
      );
      setFormulars(newFormulars);
      setCurrentInputPosition({
        index: currentInputPosition!.index - 1,
        position: 0,
      });
    },
    applyFormula: (formulaId: FormulaFSId) => {
      const formula = getFormula(formulars, formulaId);
      if (!formula) return;
      freeSpaceAction.setFormular(formula);
      const newFormulars = formulars.map((f) => {
        if (f.formula.paramId === formulaId.paramId) {
          return {
            ...f,
            isEdited: false,
          };
        }
        return f;
      });
      setFormulars(newFormulars);
    },
    cancelFormula: (formulaId: FormulaFSId) => {
      const formula = getFormula(formulars, formulaId);
      if (!formula) return;
      const newFormulars = formulars.map((f) => {
        if (f.formula.paramId === formulaId.paramId) {
          return {
            ...f,
            formula: getFormulaFreeSpace(currentConfigFreeS!, formulaId)!,
            isEdited: false,
          };
        }
        return f;
      });
      setFormulars(newFormulars);
    },
  };

  return (
    <ConfigFreeSContext.Provider
      value={{
        formulars,
        setFormulars,
        currentIdFormula,
        setCurrentIdFormula,
        setCurrentInputPosition,
        indexTofocus,
        setIndexTofocus,
        freeSpaceAction,
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
