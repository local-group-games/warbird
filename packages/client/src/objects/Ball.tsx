import { Body } from "colyseus-test-core";
import React, { useMemo } from "react";
import { useSmoothPosition } from "../hooks/useSmoothPosition";

export function Ball(props: { body: Body }) {
  const { width } = props.body;
  const objectProps = useSmoothPosition(props.body);
  const args = useMemo(() => [width / 2, 16, 16], [width]) as [
    number,
    number,
    number,
  ];

  return (
    <mesh castShadow receiveShadow {...objectProps}>
      <sphereGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}
