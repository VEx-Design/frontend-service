import { createContext, useContext, useEffect, useState } from "react";
import { Interface } from "../libs/ClassInterface/types/Interface";
import { useConfig } from "./ConfigContext";
import { Position } from "@xyflow/react";
import editPosition from "../libs/ClassInterface/editPosition";
import {
  FormulaId,
  FormulaStatus,
  Variable,
} from "../libs/ClassInterface/types/Formula";
import getFormular from "../libs/ClassInterface/FeatureFomula/getFormular";
import addVariable from "../libs/ClassInterface/FeatureFomula/addVariable";
import setStream from "../libs/ClassInterface/FeatureFomula/setStream";
import deleteVariable from "../libs/ClassInterface/FeatureFomula/deleteVariable";

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
  indexTofocus: number | undefined;
  setIndexTofocus: (index: number | undefined) => void;
  interfaceAction: InterfaceAction;
  formulaAction: FormulaAction;
}

const ConfigInterfaceContext = createContext<
  ConfigInterfaceContextValue | undefined
>(undefined);

interface InterfaceAction {
  editLocation: (newPosition: Position) => void;
  getFormular: (formulaId: FormulaId) => FormulaStatus | undefined;
}

interface FormulaAction {
  setStream: (stream: string) => void;
  addVariable: (newVariable: Variable) => void;
  deleteVariable: () => void;
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
  const [indexTofocus, setIndexTofocus] = useState<number | undefined>(
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
    editLocation: (newPosition: Position) => {
      if (currentInterface) {
        const newInterface = editPosition(currentInterface!, newPosition);
        setCurrentInterface(newInterface);
        typeAction.setInterface(currentInterface.id, newInterface);
      }
    },
    getFormular: (formulaId: FormulaId) => {
      return getFormular(formulars, formulaId);
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
    setStream: (stream: string) => {
      const newFormulars = setStream(
        formulars,
        currentIdFormula!,
        stream,
        currentInputPosition!.index
      );
      setFormulars(newFormulars);
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
