import { useReducer } from "react";

export function useForceUpdate() {
  const [, forceUpdate] = useReducer((x, _: void) => x + 1, 0);

  return forceUpdate;
}
