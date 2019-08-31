import { useEffect } from "react";
import { Camera } from "three";
import { getMousePosition } from "../helpers/getMousePosition";

export function useClick(
  camera: Camera,
  onClick: (x: number, y: number) => void,
) {
  useEffect(() => {
    const _onClick = (event: MouseEvent) => {
      const { x, y } = getMousePosition(event, camera);

      onClick(x, y);
    };

    window.addEventListener("click", _onClick);

    return () => window.removeEventListener("click", _onClick);
  }, [camera, onClick]);
}
