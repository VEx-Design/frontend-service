import { createContext, useContext, useEffect, useState } from "react";
import { useConfig } from "./ConfigContext";
import { Position } from "@xyflow/react";
import { Interface } from "../../libs/ClassInterface/types/Interface";
import {
  FormulaCondition,
  FormulaId,
  FormulaStatus,
  Variable,
} from "../../libs/ClassInterface/types/Formula";
import editPosition from "../../libs/ClassInterface/editPosition";
import getFormula from "../../libs/ClassInterface/FeatureFomula/getFormula";
import setFormula from "../../libs/ClassInterface/setFormula";
import addVariable from "../../libs/ClassInterface/FeatureFomula/addVariable";
import deleteVariable from "../../libs/ClassInterface/FeatureFomula/deleteVariable";
import setStream from "../../libs/ClassInterface/FeatureFomula/setStream";
import getFormulaInterface from "../../libs/ClassInterface/getFormulaInterface";

type InputPosition = {
  index: number;
  position: number;
};

interface ConfigInterfaceContextValue {
  currentInterface: Interface | undefined;
  setCurrentInterface: (type: Interface) => void;
  formulars: FormulaStatus[];
  setFormulars: (formulars: FormulaStatus[]) => void;
  currentIdFormula: FormulaId | undefined;
  setCurrentIdFormula: (id: FormulaId | undefined) => void;
  setCurrentInputPosition: (inputPosition: InputPosition | undefined) => void;
  indexTofocus: InputPosition | undefined;
  setIndexTofocus: (index: InputPosition | undefined) => void;
  interfaceAction: InterfaceAction;
  formulaAction: FormulaAction;
}

const ConfigInterfaceContext = createContext<
  ConfigInterfaceContextValue | undefined
>(undefined);

interface InterfaceAction {
  addInterface: () => void;
  editLocation: (newPosition: Position) => void;
  getFormular: (formulaId: FormulaId) => FormulaStatus | undefined;
  setFormular: (newFormular: FormulaStatus) => void;
}

interface FormulaAction {
  setStream: (stream: string) => void;
  addVariable: (newVariable: Variable) => void;
  deleteVariable: () => void;
  applyFormula: (formulaId: FormulaId) => void;
  cancelFormula: (formulaId: FormulaId) => void;
  addCondition: (condition: FormulaCondition) => void;
}

interface FormulaProviderProps {
  children: React.ReactNode;
}

export const ConfigInterfaceProvider = ({ children }: FormulaProviderProps) => {
  const [currentInterface, setCurrentInterface] = useState<
    Interface | undefined
  >(undefined);
  const [formulars, setFormulars] = useState<FormulaStatus[]>([]);
  const [currentIdFormula, setCurrentIdFormula] = useState<
    FormulaId | undefined
  >(undefined);
  const [currentInputPosition, setCurrentInputPosition] = useState<
    InputPosition | undefined
  >(undefined);
  const [indexTofocus, setIndexTofocus] = useState<InputPosition | undefined>(
    undefined
  );

  const { currentType, typeAction } = useConfig();

  useEffect(() => {
    if (currentType) {
      setCurrentInterface(currentType.interfaces[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType?.id]);

  useEffect(() => {
    if (currentInterface) {
      setFormulars(
        currentInterface.formulaConditions
          .map((condition) =>
            condition.formulas.map((f) => ({
              conditionId: condition.id,
              formula: f,
              isEdited: false,
            }))
          )
          .flat()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInterface?.id]);

  const interfaceAction: InterfaceAction = {
    addInterface: () => {
      const newInterface = typeAction.addInterface();
      setCurrentInterface(newInterface);
    },
    editLocation: (newPosition: Position) => {
      if (currentInterface) {
        const newInterface = editPosition(currentInterface, newPosition);
        setCurrentInterface(newInterface);
        typeAction.setInterface(currentInterface.id, newInterface);
      }
    },
    getFormular: (formulaId: FormulaId) => {
      return getFormula(formulars, formulaId);
    },
    setFormular: (newFormular: FormulaStatus) => {
      if (currentInterface) {
        const newInterface = setFormula(currentInterface, newFormular);
        setCurrentInterface(newInterface);
        typeAction.setInterface(currentInterface.id, newInterface);
      }
    },
  };

  const formulaAction: FormulaAction = {
    addVariable: (newVariable: Variable) => {
      const newFormulars = addVariable(
        formulars,
        currentIdFormula!,
        currentInputPosition!.index,
        currentInputPosition!.position,
        newVariable
      );
      setFormulars(newFormulars);
      setIndexTofocus({ index: currentInputPosition!.index + 1, position: 0 });
      setCurrentInputPosition({
        index: currentInputPosition!.index + 1,
        position: 0,
      });
    },
    deleteVariable: () => {
      const { formula: newFormulars, position } = deleteVariable(
        formulars,
        currentIdFormula!,
        currentInputPosition!.index
      );
      setFormulars(newFormulars);
      setIndexTofocus({
        index: currentInputPosition!.index - 1,
        position: position,
      });
      setCurrentInputPosition({
        index: currentInputPosition!.index - 1,
        position: position,
      });
    },
    setStream: (stream: string) => {
      const newFormulars = setStream(
        formulars,
        currentIdFormula!,
        stream,
        currentInputPosition!.index
      );
      setFormulars(newFormulars);
    },
    applyFormula: (formulaId: FormulaId) => {
      const formula = getFormula(formulars, formulaId);
      if (!formula) return;
      interfaceAction.setFormular(formula);
      const newFormulars = formulars.map((f) => {
        if (
          f.conditionId === formulaId.conditionId &&
          f.formula.paramId === formulaId.paramId
        ) {
          return {
            ...f,
            isEdited: false,
          };
        }
        return f;
      });
      setFormulars(newFormulars);
    },
    cancelFormula: (formulaId: FormulaId) => {
      const formula = getFormula(formulars, formulaId);
      if (!formula) return;
      const newFormulars = formulars.map((f) => {
        if (
          f.conditionId === formulaId.conditionId &&
          f.formula.paramId === formulaId.paramId
        ) {
          return {
            ...f,
            formula: getFormulaInterface(currentInterface!, formulaId)!,
            isEdited: false,
          };
        }
        return f;
      });
      setFormulars(newFormulars);
    },
    addCondition: (condition: FormulaCondition) => {
      if (currentInterface) {
        const newInterface = {
          ...currentInterface,
          formulaConditions: [...currentInterface.formulaConditions, condition],
        };
        setCurrentInterface(newInterface);
        typeAction.setInterface(currentInterface.id, newInterface);
      }
    },
  };

  return (
    <ConfigInterfaceContext.Provider
      value={{
        currentInterface,
        setCurrentInterface,
        formulars,
        setFormulars,
        currentIdFormula,
        setCurrentIdFormula,
        setCurrentInputPosition,
        indexTofocus,
        setIndexTofocus,
        interfaceAction,
        formulaAction,
      }}
    >
      {children}
    </ConfigInterfaceContext.Provider>
  );
};

export function useConfigInterface() {
  const context = useContext(ConfigInterfaceContext);
  if (!context) {
    throw new Error(
      "useConfigInterface must be used within a ConfigInterfaceProvider"
    );
  }
  return context;
}
