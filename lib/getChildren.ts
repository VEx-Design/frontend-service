import React, {
  isValidElement,
  ReactNode,
  ReactElement,
  ElementType,
} from "react";

// Improved function to compare types as strings
export default function getChildren<T extends ElementType>(
  children: ReactNode,
  componentCon: T,
  props?: React.ComponentProps<T>
): ReactElement | null {
  const matchingComponents = React.Children.toArray(children).filter(
    (child): child is ReactElement => {
      if (!isValidElement(child)) return false;
      const { type } = child;

      const childTypeString = typeof type === "function" ? type.name : type;
      const componentConString =
        typeof componentCon === "function" ? componentCon.name : componentCon;

      return childTypeString === componentConString;
    }
  );

  if (matchingComponents.length > 1) {
    throw new Error(
      `Expected exactly one <${componentCon}> component, but found ${matchingComponents.length}.`
    );
  }

  return matchingComponents.length === 1
    ? React.cloneElement(matchingComponents[0], props)
    : null;
}
