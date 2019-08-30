import { Body } from "colyseus-test-core";
import React from "react";
import { Vector3 } from "three";
import useModel from "../hooks/useModel";
import { useSmoothPosition } from "../hooks/useSmoothPosition";

const shipMeshScale = new Vector3(0.2, 0.2, 0.2);
const shipMeshRotation = [0, 0, Math.PI / 2];
const shipMeshOffset = [0, -2, 0];

type ShipProps = { body: Body };

export function Ship(props: ShipProps) {
  const objectProps = useSmoothPosition(props.body);
  const [geometries] = useModel("/assets/ship/scene.gltf");

  const meshes = geometries.map(({ geometry, material }) => (
    <mesh
      key={geometry.uuid}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      rotation={shipMeshRotation}
      position={shipMeshOffset}
    />
  ));

  return (
    <group scale={shipMeshScale} {...objectProps}>
      {meshes}
    </group>
  );
}
