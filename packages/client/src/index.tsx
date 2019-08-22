import { BodyState, command, PhysicsState } from "colyseus-test-core";
import { Client } from "colyseus.js";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, useRender } from "react-three-fiber";
import { Group, PCFSoftShadowMap, Vector3 } from "three";
import { createInputListener } from "./input";

// @ts-ignore
const client = new Client(`ws://${window.APP_CONFIGURATION.SERVER_URL}`);
const room = client.join<PhysicsState>("main");
const input = createInputListener({
  KeyW: "thrustForward",
  KeyA: "turnLeft",
  KeyS: "thrustReverse",
  KeyD: "turnRight",
  Space: "fire",
  ShiftLeft: "afterburners",
});

setInterval(
  () => room.hasJoined && room.send(command(input.command)),
  (1 / 60) * 1000,
);

function Plane() {
  return (
    <mesh receiveShadow>
      <planeGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#171717" />
    </mesh>
  );
}

const cameraScale = new Vector3(0.05, 0.05, 0.05);

function Game() {
  const [boxes, setBoxes] = useState<any>([]);
  const [bodies, setBodies] = useState<BodyState[]>([]);

  useEffect(() => {
    const { remove } = room.onStateChange.add((state: PhysicsState) => {
      setBodies(Object.values(state.bodies));
      // setBoxes(
      //   Object.values(state.bodies).map((body: BodyState) => {
      //     return <Player key={body.id} body={body} />;
      //   }),
      // );
    });

    return remove;
  }, []);
  const ships = bodies.map((body: BodyState) => (
    <Player key={body.id} body={body} />
  ));

  console.log(
    bodies.length
      ? new Vector3(bodies[0].x, bodies[0].y, 10)
      : new Vector3(0, 0, 10),
  );

  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
      camera={{
        position: bodies.length
          ? new Vector3(bodies[0].x, bodies[0].y, 10)
          : new Vector3(0, 0, 10),
        scale: cameraScale,
      }}
      orthographic
    >
      <orthographicCamera />
      <Plane />
      <ambientLight intensity={0.5} />
      {ships}
    </Canvas>
  );
}

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function Player(props: { body: BodyState }) {
  const ref = useRef<Group>();

  useRender(
    () => {
      const { current } = ref;

      if (!current) {
        return;
      }

      const angle = lerp(current.rotation.z, props.body.angle, 0.2);
      const x = lerp(current.position.x, props.body.x, 0.2);
      const y = lerp(current.position.y, props.body.y, 0.2);

      current.rotation.set(0, 0, angle);
      current.position.set(x, y, 0);
    },
    false,
    [props.body],
  );

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <boxGeometry attach="geometry" />
        <meshStandardMaterial attach="material" />
      </mesh>
    </group>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));
