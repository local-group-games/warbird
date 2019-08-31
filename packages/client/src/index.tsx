import {
  Body,
  command,
  Entity,
  isBall,
  isShip,
  isTile,
  SystemState,
  isBullet,
  placeTile,
} from "colyseus-test-core";
import { Client, Room } from "colyseus.js";
import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Canvas, CanvasContext, useRender, useThree } from "react-three-fiber";
import { Math, PCFSoftShadowMap, Vector3, Euler } from "three";
import { createInputListener } from "./input";
import { Ship } from "./objects/Ship";
import { Tile } from "./objects/Tile";
import { Ball } from "./objects/Ball";
import { Bullet } from "./objects/Bullet";

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
    `ws://${(window as any).APP_CONFIGURATION.SERVER_HOST.replace(
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
      >
        <Main room={room} client={client} />
      </Canvas>
    );
  }

  ReactDOM.render(<Game />, document.getElementById("root"));
}

function Main(props: { room: Room; client: Client }) {
  const { client, room } = props;
  const [entities, setEntities] = useState<Entity[]>([]);
  const [playerBody, setPlayerBody] = useState<Body>();
  const { camera } = useThree();

  useEffect(() => {
    var vec = new Vector3(); // create once and reuse
    var pos = new Vector3(); // create once and reuse

    window.addEventListener("click", event => {
      vec.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5,
      );

      vec.unproject(camera);

      vec.sub(camera.position).normalize();

      var distance = -camera.position.z / vec.z;

      pos.copy(camera.position).add(vec.multiplyScalar(distance));
      // const blah = camera.rotation.toVector3().negate();

      // vec.unproject(camera);
      // vec.applyEuler(new Euler(blah.x, blah.y, 0));

      room.send(placeTile(pos.x, pos.y));
    });
  }, []);

  useEffect(() => {
    const listener = (state: SystemState) => {
      const entities = Object.values(state.entities);
      const entityId = state.entityIdsByClientSessionId[room.sessionId];
      const playerBody = entities.find(entity => entity.id === entityId);

      setEntities(entities);
      setPlayerBody(playerBody);
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
        Math.lerp(camera.position.x, playerBody.x, 0.3),
        Math.lerp(camera.position.y, playerBody.y, 0.3) - 1,
        50,
      );
    },
    false,
    [entities],
  );

  const ships = entities.filter(isShip);
  const tiles = entities.filter(isTile);
  const balls = entities.filter(isBall);
  const bullets = entities.filter(isBullet);

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
        <Ship key={body.id} body={body} />
      ))}
      {tiles.map(tile => (
        <Tile key={tile.id} tile={tile} />
      ))}
      {balls.map(body => (
        <Ball key={body.id} body={body} />
      ))}
      {bullets.map(body => (
        <Bullet key={body.id} body={body} />
      ))}
    </Suspense>
  );
}

const defaultCameraOptions = {
  fov: 45,
  position: new Vector3(0, 0, 10),
};

const onCanvasCreated = ({ gl }: CanvasContext) => {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = PCFSoftShadowMap;
};

main();
