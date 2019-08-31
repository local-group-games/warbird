import { Tile as TileEntity } from "colyseus-test-core";
import React, { useMemo } from "react";
import { Vector3 } from "three";

export function Tile(props: { entity: TileEntity }) {
  const { x, y } = props.entity;
  const position = useMemo(() => new Vector3(x, y, 0), [x, y]);

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}
