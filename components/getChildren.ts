import React, {
  isValidElement,
  ReactNode,
  ReactElement,
  ElementType,
} from "react";

export function getChild<T extends ElementType>(
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

export function getChildren<T extends ElementType>(
  children: ReactNode,
  componentCon: T,
  props?: React.ComponentProps<T>
): ReactElement[] {
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

  const targetComponents = matchingComponents.map((component) => {
    return React.cloneElement(component, props);
  });

  return targetComponents;
}
