import { Body } from "colyseus-test-core";
import React, { useRef } from "react";
import { useRender } from "react-three-fiber";
import { Group, Math as M, Vector3 } from "three";
import useModel from "../hooks/useModel";

const shipMeshScale = new Vector3(0.25, 0.25, 0.25);
const shipMeshRotation = [0, 0, Math.PI / 2];
const shipMeshOffset = [0, -2, 0];

type ShipProps = { body: Body };

export function Ship(props: ShipProps) {
  const ref = useRef<Group>();
  const [geometries] = useModel("/assets/ship/scene.gltf");

  useRender(
    () => {
      const { current: group } = ref;

      if (!group) {
        return;
      }

      group.rotation.set(0, 0, M.lerp(group.rotation.z, props.body.angle, 0.3));
      group.position.set(
        M.lerp(group.position.x, props.body.x, 0.3),
        M.lerp(group.position.y, props.body.y, 0.3),
        0,
      );
    },
    false,
    [props.body],
  );

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
    <group ref={ref} scale={shipMeshScale}>
      {meshes}
    </group>
  );
}
