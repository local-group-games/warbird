import {
  Body,
  changeWeapon,
  command,
  Entity,
  EntityType,
  placeTile,
  Player,
  RoomState,
} from "@warbird/core";
import { loadFont } from "@warbird/ui";
import { waitMs } from "@warbird/utils";
import { Client, Room } from "colyseus.js";
import React from "react";
import ReactDOM from "react-dom";
import { createExplosion } from "./animations/explosion";
import { App } from "./App";
import { getMousePosition } from "./helpers/getMousePosition";
import { createInputListener } from "./input";
import { createBall } from "./objects/ball";
import { createProjectile } from "./objects/projectile";
import { createShip } from "./objects/ship";
import { createTile } from "./objects/tile";
import { createWreck } from "./objects/wreck";
import { createSkyBox } from "./skybox";
import { Animation, RenderObject } from "./types";

const explosionDuration = 500;

const input = createInputListener({
  KeyW: "thrustForward",
  KeyA: "turnLeft",
  KeyS: "thrustReverse",
  KeyD: "turnRight",
  Space: "activateWeapon",
  ShiftLeft: "afterburners",
});

async function preload() {
  await loadFont(
    "PragmataPro Mono Liga",
    "./assets/fonts/PragmataProMonoLiga.woff2",
  );
}

function cacheSession(room: Room) {
  localStorage.setItem("roomId", room.id);
  localStorage.setItem("sessionId", room.sessionId);
}

function getSession() {
  const roomId = localStorage.getItem("roomId");
  const sessionId = localStorage.getItem("sessionId");

  return { roomId, sessionId };
}

function clearSession() {
  localStorage.removeItem("roomId");
  localStorage.removeItem("sessionId");
}

async function connect<S>(
  client: Client,
  roomName: string,
  pollInterval: number = 2000,
) {
  let room: Room<S> | undefined;

  while (!room) {
    const { roomId, sessionId } = getSession();

    try {
      if (roomId && sessionId) {
        room = await client.reconnect(roomId, sessionId);
      } else {
        room = await client.joinOrCreate(roomName);
      }
    } catch (e) {
      clearSession();
      await waitMs(pollInterval);
    }
  }

  cacheSession(room);

  return room as Room<S>;
}

const objectFactoryByEntityType: {
  [key: number]: (entity: Entity) => RenderObject | Promise<RenderObject>;
} = {
  [EntityType.Ball]: createBall,
  [EntityType.Bullet]: createProjectile,
  [EntityType.Ship]: createShip,
  [EntityType.Tile]: createTile,
  [EntityType.Wreck]: createWreck,
};

async function main() {
  const ui = document.getElementById("ui") as HTMLElement;
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  const {
    AmbientLight,
    DirectionalLight,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Vector3,
  } = await import("three");
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  const ambientLight = new AmbientLight(0xffffff, 0.2);
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  const scene = new Scene();
  const camera = new PerspectiveCamera(30);
  const skyCamera = new PerspectiveCamera(30);
  const client = new Client(
    `ws://${(window as any).APP_CONFIGURATION.SERVER_HOST.replace(
      "localhost",
      window.location.hostname,
    )}`,
  );
  const animations = new Set<Animation>();
  const sky = await createSkyBox();

  renderer.setClearAlpha(0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  camera.position.set(0, 0, 75);
  skyCamera.position.set(0, 0, 75);

  directionalLight.position.set(-5, -15, 10);
  directionalLight.shadowMapWidth = 2048;
  directionalLight.shadowMapHeight = 2048;

  scene.add(ambientLight);
  scene.add(directionalLight);

  let previousTime = 0;

  function render(time: number) {
    const player: Player = room.state.players[room.sessionId];
    const now = performance.now();

    if (!previousTime) {
      previousTime = time;
    }

    const dt = time - previousTime;

    previousTime = time;

    objectsByEntity.forEach(object => object.update(dt));

    if (player && player.shipId) {
      const ship = room.state.entities[player.shipId];

      if (ship) {
        const object = objectsByEntity.get(ship);

        if (object) {
          skyCamera.position.x = object.object.position.x * 0.05;
          skyCamera.position.y = object.object.position.y * 0.05;
          camera.position.x = object.object.position.x;
          camera.position.y = object.object.position.y;
        }
      }
    }

    animations.forEach(animation => {
      animation.update(dt);

      if (now - animation.start >= animation.duration) {
        animations.delete(animation);
        scene.remove(animation.object);
      }
    });
    renderer.autoClear = true;
    renderer.render(scene, camera);
    renderer.autoClear = false;
    renderer.render(sky, skyCamera);
    requestAnimationFrame(render);
  }

  const [room] = await Promise.all([
    connect<RoomState>(
      client,
      "main",
    ),
    preload(),
  ]);

  const objectsByEntity = new Map<Entity, RenderObject>();

  async function registerObject(entity: Entity) {
    let object = objectsByEntity.get(entity);

    if (!object) {
      const createObject = objectFactoryByEntityType[entity.type];

      if (createObject) {
        object = await createObject(entity);
      } else {
        throw new Error(`Entity ${(entity as Entity).type} not supported.`);
      }

      scene.add(object.object);
      objectsByEntity.set(entity, object);
    }

    return object;
  }

  const onAdd = async (entity: Entity) => {
    if (Entity.hasComponent(entity, Body)) {
      registerObject(entity);
    }
  };
  const onRemove = async (entity: Entity) => {
    if (Entity.hasComponent(entity, Body)) {
      const object = objectsByEntity.get(entity);

      if (object) {
        scene.remove(object.object);
      }

      objectsByEntity.delete(entity);
    }

    if (entity.type === EntityType.Ship) {
      const shipBody = Entity.getComponent(entity, Body);
      const explosion = await createExplosion(
        shipBody.x,
        shipBody.y,
        explosionDuration,
      );

      animations.add(explosion);
      scene.add(explosion.object);
    }
  };

  for (const entityId in room.state.entities) {
    onAdd(room.state.entities[entityId]);
  }

  room.state.entities.onAdd = onAdd;
  room.state.entities.onRemove = onRemove;

  input.subscribe((key, value) => room.send(command(key, value)));

  window.addEventListener("mousedown", e => {
    const vec = new Vector3();
    const pos = new Vector3();
    const { x, y } = getMousePosition(e, camera, vec, pos);

    room.send(placeTile(x, y));
  });

  window.addEventListener("keydown", e => {
    if (e.repeat) {
      return;
    }

    if (e.key === "1" || e.key === "2" || e.key === "3") {
      room.send(changeWeapon(Number(e.key) - 1));
    }
  });

  function onWindowResize() {
    const { innerWidth, innerHeight } = window;

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    skyCamera.aspect = innerWidth / innerHeight;
    skyCamera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight);
  }

  window.addEventListener("resize", onWindowResize);

  onWindowResize();

  requestAnimationFrame(render);

  ReactDOM.render(<App room={room} />, ui);
}

main();
