import { BodyState, command, SystemState, Tile } from "colyseus-test-core";
import { Client } from "colyseus.js";
import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, CanvasContext, useRender, useThree } from "react-three-fiber";
import { Math as M, PCFSoftShadowMap, Vector3, Euler } from "three";
import { createInputListener } from "./input";
import { Ship } from "./objects/Ship";

const client = new Client(
  `ws://${(window as any).APP_CONFIGURATION.SERVER_URL.replace(
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

input.subscribe((key, value) => room.send(command(key, value)));

function Wall(props: { tile: Tile }) {
  return (
    <mesh>
      <boxGeometry attach="geometry" />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}

function Main() {
  const [bodies, setBodies] = useState<BodyState[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [playerBody, setPlayerBody] = useState<BodyState>();
  const { camera } = useThree();

  useEffect(() => {
    const { remove } = room.onStateChange.add((state: SystemState) => {
      setBodies(Object.values(state.physics.bodies));
      setTiles(state.tiles);

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
        M.lerp(camera.position.x, playerBody.x, 0.2),
        M.lerp(camera.position.y, playerBody.y, 0.2) - 1,
        10,
      );
    },
    false,
    [bodies],
  );

  const ships = bodies.map(body => <Ship key={body.id} body={body} />);
  const walls = tiles.map(tile => <Wall tile={tile} />);

  return (
    <Suspense fallback={null}>
      <directionalLight
        castShadow
        intensity={0.8}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={0.8} />
      {ships}
      {walls}
    </Suspense>
  );
}

const defaultCameraOptions = {
  zoom: 25,
  rotation: new Euler(0.5, 0),
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
      pixelRatio={window.devicePixelRatio}
      style={{ backgroundColor: "#111" }}
    >
      <Main />
    </Canvas>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));
