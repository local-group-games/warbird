import { BodyState, PhysicsState } from "colyseus-test-core";
import { Client } from "colyseus.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, useRender } from "react-three-fiber";
import { Group, Vector3 } from "three";

// @ts-ignore
const client = new Client(`ws://${window.APP_CONFIGURATION.SERVER_URL}`);
const room = client.join("main");

function Game() {
  const [boxes, setBoxes] = useState<any>([]);

  useEffect(() => {
    const { remove } = room.onStateChange.add((state: PhysicsState) => {
      setBoxes(
        Object.values(state.bodies).map((body: BodyState) => {
          return <Box key={body.id} angle={body.angle} />;
        }),
      );
    });

    return remove;
  }, []);

  return <Canvas>{boxes}</Canvas>;
}

document.addEventListener("keydown", e => {
  if (e.keyCode === 37) {
    room.send("turn");
  }
});

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function Box({ angle }: { angle: number }) {
  const vertices = useMemo(
    () =>
      [[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]].map(
        v => new Vector3(...v),
      ),
    [],
  );
  const ref = useRef<Group>();

  useRender(
    () => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const nextAngle = lerp(current.rotation.y, angle, 0.2);

      current.rotation.set(0, nextAngle, 0);
    },
    false,
    [angle],
  );

  return (
    <group ref={ref}>
      <line>
        <geometry attach="geometry" vertices={vertices} />
        <lineBasicMaterial attach="material" color="black" />
      </line>
      <mesh>
        <octahedronGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          color="peachpuff"
          opacity={0.5}
          transparent
        />
      </mesh>
    </group>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));
