import { Ball as BallEntity, Body } from "colyseus-test-core";
import React, { useMemo } from "react";
import { useSmoothPosition } from "../hooks/useSmoothPosition";

export function Ball(props: { body: Body; ball: BallEntity }) {
  const { body } = props;
  const { width } = body;
  const objectProps = useSmoothPosition(body, 0.6);
  const args = useMemo(() => [width / 2, 16, 16] as [number, number, number], [
    width,
  ]);

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
