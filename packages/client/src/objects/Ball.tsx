import { Body } from "colyseus-test-core";
import React, { useMemo, useRef } from "react";
import { Group, Math as M } from "three";
import { useRender } from "react-three-fiber";

export function Ball(props: { body: Body }) {
  const { width } = props.body;
  const ref = useRef<Group>();
  const args = useMemo(() => [width / 2, 16, 16], [width]) as [
    number,
    number,
    number,
  ];

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

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}
