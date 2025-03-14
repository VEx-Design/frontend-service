import VariableBadge from "./VariableBadge";
import { useConfigInterface } from "@/features/systems/contexts/Configuration/ConfigInterfaceContext";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import { useConfigType } from "@/features/systems/contexts/Configuration/ConfigTypeContext";

export default function VariableLister() {
  const { config } = useConfig();
  const { currentType } = useConfigType();
  const { currentInterface } = useConfigInterface();

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">Type variables:</h3>
        <div className="overflow-x-auto pb-1">
          {!currentType || currentType.properties.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No type properties available
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentType.properties.map((prop) => (
                <VariableBadge key={prop.id} type="prop" prop={prop} canClick />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          {currentInterface?.name || "Interface"} parameters:
        </h3>
        <div className="overflow-x-auto pb-2">
          {!currentInterface ||
          !config.parameters ||
          config.parameters.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No interface parameters available
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {config.parameters.map((param) => (
                <VariableBadge
                  key={`${currentInterface.id}-${param.id}`}
                  type="interface"
                  inter={currentInterface}
                  param={param}
                  canClick
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
