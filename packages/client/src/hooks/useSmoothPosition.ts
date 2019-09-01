import { Body } from "colyseus-test-core";
import { useRef } from "react";
import { useRender } from "react-three-fiber";
import { Math, Object3D } from "three";

export const useSmoothPosition = (body: Body, alpha: number) => {
  const { x, y, angle } = body;
  const ref = useRef<Object3D>();
  const init = useRef(true);

  useRender(
    () => {
      if (!ref.current) {
        return;
      }

      if (x === 0 && y === 0) {
        return;
      }

      if (init.current) {
        init.current = false;
        ref.current.rotation.set(0, 0, angle);
        ref.current.position.set(x, y, 0);
        return;
      }

      const nextAngle = Math.lerp(ref.current.rotation.z, angle, 0.9);
      const nextX = Math.lerp(ref.current.position.x, x, alpha);
      const nextY = Math.lerp(ref.current.position.y, y, alpha);

      ref.current.rotation.set(0, 0, nextAngle);
      ref.current.position.set(nextX, nextY, 0);
    },
    false,
    [alpha, x, y, angle],
  );

  return { ref, visible: !init.current };
};
