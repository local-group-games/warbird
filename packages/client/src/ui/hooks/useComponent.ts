import { Component, Constructor, Entity } from "@warbird/ecs";
import { useEffect, useMemo } from "react";
import { useForceUpdate } from "./useForceUpdate";

type InstanceMap<T extends Constructor<Component>[]> = {
  [P in keyof T]: T[P] extends Constructor<infer _> ? _ : never;
};

export function useComponent<T extends Constructor<Component>[]>(
  entity: Entity,
  ...ctors: T
): InstanceMap<T> {
  const forceUpdate = useForceUpdate();
  const out = useMemo(
    () => ctors.map(ctor => Entity.getComponent(entity, ctor)),
    [ctors],
  );

  useEffect(() => {
    const components = ctors.map(ctor => Entity.getComponent(entity, ctor));

    for (let i = 0; i < components.length; i++) {
      const component = components[i];

      out[i] = component;
      component.onChange = forceUpdate as () => void;
    }
  }, [entity, forceUpdate, out]);

  return out as InstanceMap<T>;
}
