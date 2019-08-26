import { Body } from "colyseus-test-core";
import React, { useEffect, useMemo, useRef } from "react";
import { useRender } from "react-three-fiber";
import { Math as M, Object3D } from "three";

const useSmoothPosition = (body: Body, alpha: number = 0.3) => {
  const { x, y } = body;
  const object = useRef<Object3D>();
  const init = useRef(false);

  useEffect(() => {
    if (object.current) {
      object.current.position.set(x, y, 0);
      init.current = true;
    }
  }, []);

  useRender(
    () => {
      if (object.current) {
        if (init.current) {
          object.current.position.set(
            M.lerp(object.current.position.x, x, alpha),
            M.lerp(object.current.position.y, y, alpha),
            0,
          );
        } else {
          object.current.position.set(x, y, 0);
          init.current = true;
        }
      }
    },
    false,
    [alpha, x, y],
  );

  return object;
};

export function Bullet(props: { body: Body }) {
  const { width } = props.body;
  const args = useMemo(() => [width / 2, 5], [width]) as [number, number];
  const ref = useSmoothPosition(props.body);

  return (
    <mesh ref={ref}>
      <circleGeometry attach="geometry" args={args} />
      <meshBasicMaterial attach="material" />
    </mesh>
  );
}
