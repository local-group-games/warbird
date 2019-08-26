import { Body } from "colyseus-test-core";
import React, { useMemo, useRef } from "react";
import { useRender } from "react-three-fiber";
import { Math as M, Mesh } from "three";

export function Ball(props: { body: Body }) {
  const { width } = props.body;
  const ref = useRef<Mesh>();
  const args = useMemo(() => [width / 2, 16, 16], [width]) as [
    number,
    number,
    number,
  ];

  useRender(
    () => {
      const { current: mesh } = ref;

      if (!mesh) {
        return;
      }

      mesh.rotation.set(0, 0, M.lerp(mesh.rotation.z, props.body.angle, 0.3));
      mesh.position.set(
        M.lerp(mesh.position.x, props.body.x, 0.3),
        M.lerp(mesh.position.y, props.body.y, 0.3),
        0,
      );
    },
    false,
    [props.body],
  );

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}
