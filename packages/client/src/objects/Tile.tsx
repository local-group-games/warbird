import { Body, Tile as TileEntity } from "colyseus-test-core";
import React, { useMemo } from "react";
import { Vector3 } from "three";

const args = [1, 1, 1] as [number, number, number];

export function Tile(props: { body: Body; tile: TileEntity }) {
  const { body, tile } = props;
  const { x, y } = body;
  const position = useMemo(() => new Vector3(x, y, 0), [x, y]);

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={args} />
      <meshStandardMaterial
        attach="material"
        color={tile.invulnerable ? "#fff" : "#6933fe"}
        opacity={tile.invulnerable ? 1 : tile.health / 100}
        metalness={0.2}
        roughness={0.7}
        transparent
      />
    </mesh>
  );
}
