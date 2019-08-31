import { Tile as TileEntity, isDestructible } from "colyseus-test-core";
import React, { useMemo } from "react";
import { Vector3 } from "three";

const args = [1, 1, 1] as [number, number, number];

export function Tile(props: { entity: TileEntity }) {
  const { x, y, health } = props.entity;
  const position = useMemo(() => new Vector3(x, y, 0), [x, y]);

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={args} />
      <meshStandardMaterial
        attach="material"
        color={isDestructible(props.entity) ? "#6933fe" : "#fff"}
        opacity={isDestructible(props.entity) ? health / 100 : 1}
        metalness={0.2}
        roughness={0.7}
        transparent
      />
    </mesh>
  );
}
