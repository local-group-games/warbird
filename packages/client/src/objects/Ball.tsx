import { Body } from "colyseus-test-core";
import React, { useMemo } from "react";
import { useSmoothPosition } from "../hooks/useSmoothPosition";

export function Ball(props: { entity: Body }) {
  const { width } = props.entity;
  const objectProps = useSmoothPosition(props.entity, 0.6);
  const args = useMemo(() => [width / 2, 16, 16], [width]) as [
    number,
    number,
    number,
  ];

  return (
    <mesh castShadow receiveShadow {...objectProps}>
      <sphereGeometry attach="geometry" args={args} />
      <meshStandardMaterial
        attach="material"
        metalness={0.4}
        roughness={0.7}
        wireframe
      />
    </mesh>
  );
}
