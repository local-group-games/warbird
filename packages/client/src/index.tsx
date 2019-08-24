import {
  Body,
  command,
  SystemState,
  Tile,
  Ship,
  Entity,
} from "colyseus-test-core";
import { Client, Room } from "colyseus.js";
import React, { Suspense, useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { Canvas, CanvasContext, useRender, useThree } from "react-three-fiber";
import { Euler, Math as M, PCFSoftShadowMap, Vector2, Vector3 } from "three";
import { createInputListener } from "./input";
import { Ship as ShipComponent } from "./objects/Ship";

const input = createInputListener({
  KeyW: "thrustForward",
  KeyA: "turnLeft",
  KeyS: "thrustReverse",
  KeyD: "turnRight",
  Space: "fire",
  ShiftLeft: "afterburners",
});

async function main() {
  const client = new Client(
    `ws://${(window as any).APP_CONFIGURATION.SERVER_URL.replace(
      "localhost",
      window.location.hostname,
    )}`,
  );
  const room = await client.joinOrCreate<SystemState>("main");

  input.subscribe((key, value) => room.send(command(key, value)));

  function Game() {
    return (
      <Canvas
        onCreated={onCanvasCreated}
        camera={defaultCameraOptions}
        pixelRatio={window.devicePixelRatio}
        style={{ backgroundColor: "#111" }}
        orthographic
      >
        <Main room={room} client={client} />
      </Canvas>
    );
  }

  ReactDOM.render(<Game />, document.getElementById("root"));
}

function TileComponent(props: { tile: Tile }) {
  const { x, y } = props.tile;
  const position = useMemo(() => new Vector3(x, y, 0), [x, y]);

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}

const isShip = (entity: Entity): entity is Ship => entity.type === "ship";
const isTile = (entity: Entity): entity is Tile => entity.type === "tile";

function Main(props: { room: Room; client: Client }) {
  const { client, room } = props;
  const [entities, setEntities] = useState<Entity[]>([]);
  const [playerBody, setPlayerBody] = useState<Body>();
  const { camera } = useThree();

  useEffect(() => {
    const listener = (state: SystemState) => {
      setEntities(state.entities);

      const entityId = state.entityIdsByClientSessionId[room.sessionId];
      const body = state.entities.find(entity => entity.id === entityId);

      setPlayerBody(body);
    };

    room.onStateChange(listener);

    return () => room.onStateChange.remove(listener);
  }, [client, room]);

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
    [entities],
  );

  const ships = entities.filter(isShip);
  const tiles = entities.filter(isTile);

  return (
    <Suspense fallback={null}>
      <directionalLight
        intensity={0.3}
        position={[-50, -175, 100]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={0.3} />
      {ships.map(body => (
        <ShipComponent key={body.id} body={body} />
      ))}
      {tiles.map(tile => (
        <TileComponent key={tile.id} tile={tile} />
      ))}
    </Suspense>
  );
}

const defaultCameraOptions = {
  rotation: new Euler(0.15, 0.1, 0),
  position: new Vector3(0, 0, 10),
  zoom: 30,
};

const onCanvasCreated = ({ gl }: CanvasContext) => {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = PCFSoftShadowMap;
};

main();
