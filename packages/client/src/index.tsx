import { BodyState, command, SystemState } from "colyseus-test-core";
import { Client } from "colyseus.js";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, useRender, useThree, CanvasContext } from "react-three-fiber";
import { Group, PCFSoftShadowMap, Vector3 } from "three";
import { createInputListener } from "./input";

const client = new Client(
  // @ts-ignore
  `ws://${window.APP_CONFIGURATION.SERVER_URL.replace(
    "localhost",
    window.location.hostname,
  )}`,
);
const room = client.join<SystemState>("main");
const input = createInputListener({
  KeyW: "thrustForward",
  KeyA: "turnLeft",
  KeyS: "thrustReverse",
  KeyD: "turnRight",
  Space: "fire",
  ShiftLeft: "afterburners",
});

setInterval(() => {
  if (room.hasJoined) {
    room.send(command(input.command));
  }
}, (1 / 60) * 1000);

function Plane() {
  return (
    <mesh receiveShadow>
      <planeGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#171717" />
    </mesh>
  );
}

const cameraScale = new Vector3(0.05, 0.05, 0.05);

function Main() {
  const [bodies, setBodies] = useState<BodyState[]>([]);
  const [playerBody, setPlayerBody] = useState<BodyState>();
  const { camera } = useThree();

  useEffect(() => {
    const { remove } = room.onStateChange.add((state: SystemState) => {
      setBodies(Object.values(state.physics.bodies));

      if (client.id) {
        const entityId = state.entityIdsByClientId[client.id];
        const body: BodyState = state.physics.bodies[entityId];

        setPlayerBody(body);
      }
    });

    return remove;
  }, []);

  useRender(
    () => {
      if (!playerBody) {
        return;
      }
      camera.position.set(
        lerp(camera.position.x, playerBody.x, 0.2),
        lerp(camera.position.y, playerBody.y, 0.2),
        10,
      );
    },
    false,
    [bodies],
  );

  const ships = bodies.map(body => <Ship key={body.id} body={body} />);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Plane />
      {ships}
    </>
  );
}

const defaultCameraOptions = {
  scale: cameraScale,
};

const onCanvasCreated = ({ gl }: CanvasContext) => {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = PCFSoftShadowMap;
};

function Game() {
  return (
    <Canvas
      onCreated={onCanvasCreated}
      camera={defaultCameraOptions}
      orthographic
    >
      <Main />
    </Canvas>
  );
}

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function Ship(props: { body: BodyState }) {
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
