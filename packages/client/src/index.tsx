import {
  BodySchema,
  command,
  EntitySchema,
  GameStateSchema,
  isBall,
  isBody,
  isBullet,
  isShip,
  isTile,
  placeTile,
  Player,
  isWreckage,
} from "colyseus-test-core";
import { Client, Room } from "colyseus.js";
import {
  AmbientLight,
  DirectionalLight,
  Material,
  Math,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { createExplosion } from "./animations/explosion";
import { getMousePosition } from "./helpers/getMousePosition";
import { createInputListener } from "./input";
import { createBall } from "./objects/ball";
import { createProjectile } from "./objects/projectile";
import { createShip } from "./objects/ship";
import { createTile } from "./objects/tile";
import { createWreckage } from "./objects/wreckage";
import { Animation } from "./types";

const explosionDuration = 1000;

const input = createInputListener({
  KeyW: "thrustForward",
  KeyA: "turnLeft",
  KeyS: "thrustReverse",
  KeyD: "turnRight",
  Space: "fire",
  ShiftLeft: "afterburners",
});

async function preload() {
  // @ts-ignore
  const myFont = new FontFace(
    "PragmataPro Mono Liga",
    "url(./assets/fonts/PragmataProMonoLiga.woff2)",
  );
  const font = await myFont.load();

  // @ts-ignore
  document.fonts.add(font);
}

function waitMs(ms: number) {
  return new Promise(res => setTimeout(res, ms));
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

async function main() {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  const ambientLight = new AmbientLight(0xffffff, 0.2);
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  const scene = new Scene();
  const camera = new PerspectiveCamera(45);
  const client = new Client(
    `ws://${(window as any).APP_CONFIGURATION.SERVER_HOST.replace(
      "localhost",
      window.location.hostname,
    )}`,
  );
  const animations = new Set<Animation>();

  renderer.setClearAlpha(0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  camera.position.set(0, 0, 50);

  directionalLight.position.set(-5, -15, 10);
  directionalLight.shadowMapWidth = 2048;
  directionalLight.shadowMapHeight = 2048;

  scene.add(ambientLight);
  scene.add(directionalLight);

  function render() {
    const player: Player = room.state.players[room.sessionId];
    const now = performance.now();

    objectsByEntity.forEach((object, entity: BodySchema) => {
      object.position.set(
        Math.lerp(object.position.x, entity.x, 0.6),
        Math.lerp(object.position.y, entity.y, 0.6),
        0,
      );
      object.rotation.set(
        0,
        0,
        Math.lerp(object.rotation.z, entity.angle, 0.75),
      );

      if (isTile(entity)) {
        const material = (object as Mesh).material as Material;

        material.opacity = Math.lerp(
          material.opacity,
          entity.health / 100,
          0.5,
        );
      }
    });

    if (player && player.shipId) {
      const ship = room.state.entities[player.shipId];

      if (ship) {
        const object = objectsByEntity.get(ship);

        if (object) {
          camera.position.x = object.position.x;
          camera.position.y = object.position.y;
        }
      }
    }

    animations.forEach(animation => {
      animation.update();

      if (now - animation.start >= animation.duration) {
        animations.delete(animation);
        scene.remove(animation.object);
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  const [room] = await Promise.all([
    connect<GameStateSchema>(
      client,
      "main",
    ),
    preload(),
  ]);

  const objectsByEntity = new Map<BodySchema, Object3D>();

  async function registerBody(entity: BodySchema) {
    let object = objectsByEntity.get(entity);

    if (!object) {
      if (isShip(entity)) {
        object = await createShip(entity);
      } else if (isTile(entity)) {
        object = createTile(entity);
      } else if (isBall(entity)) {
        object = createBall(entity);
      } else if (isBullet(entity)) {
        object = createProjectile(entity);
      } else if (isWreckage(entity)) {
        object = createWreckage(entity);
      } else {
        throw new Error(
          `Entity ${(entity as EntitySchema).type} not supported.`,
        );
      }

      scene.add(object);
      objectsByEntity.set(entity, object);
    }

    return object;
  }

  const onAdd = async (entity: EntitySchema) => {
    if (isBody(entity)) {
      registerBody(entity);
    }
  };
  const onRemove = (entity: EntitySchema) => {
    if (isBody(entity)) {
      const object = objectsByEntity.get(entity);

      if (object) {
        scene.remove(object);
      }

      objectsByEntity.delete(entity);
    }

    if (isShip(entity)) {
      const explosion = createExplosion(entity.x, entity.y, explosionDuration);

      animations.add(explosion);
      scene.add(explosion.object);
    }
  };

  Object.values(room.state.entities).forEach(onAdd);

  room.state.entities.onAdd = onAdd;
  room.state.entities.onRemove = onRemove;

  input.subscribe((key, value) => room.send(command(key, value)));

  window.addEventListener("mousedown", e => {
    const { x, y } = getMousePosition(e, camera);

    room.send(placeTile(x, y));
  });

  function onWindowResize() {
    const { innerWidth, innerHeight } = window;

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight);
  }

  window.addEventListener("resize", onWindowResize);

  onWindowResize();

  requestAnimationFrame(render);
}

main();
