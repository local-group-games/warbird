import { Body, Ship as ShipEntity } from "colyseus-test-core";
import React, { useRef } from "react";
import { useRender } from "react-three-fiber";
import { Sprite, Vector3 } from "three";
import { Text } from "../components/Text";
import useModel from "../hooks/useModel";
import { useSmoothPosition } from "../hooks/useSmoothPosition";

const shipMeshScale = new Vector3(0.2, 0.2, 0.2);
const shipMeshRotation = [0, 0, Math.PI / 2];
const shipMeshOffset = [0, -2, 0];

type ShipProps = { ship: ShipEntity; body: Body; showLabel?: boolean };

const defaultTextPosition = new Vector3(1, 0, 0);

export function Ship(props: ShipProps) {
  const { body, showLabel = true } = props;
  const objectProps = useSmoothPosition(body, 0.6);
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

  const text = useRef<Sprite>(null);

  useRender(() => {
    if (text.current && objectProps.ref.current) {
      const pos = objectProps.ref.current.position.clone();
      pos.x += 2;
      text.current.position.copy(pos);
    }
  });

  return (
    <>
      <Text position={defaultTextPosition} ref={text} visible={showLabel}>
        {props.ship.id}
      </Text>
      <group scale={shipMeshScale} {...objectProps}>
        {meshes}
      </group>
    </>
  );
}
