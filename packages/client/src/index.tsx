import { DataChange } from "@colyseus/schema";
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
import { App } from "./App";
import { createInputListener } from "./input";
import { createExplosion } from "./render/animations/explosion";
import { createScene } from "./render/createScene";
import { getMousePosition } from "./render/helpers/getMousePosition";
import { cacheSession, clearSession, getSession } from "./session";

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

async function connect<S>(
  client: Client,
  roomName: string,
  pollInterval: number = 2000,
) {
  let room: Room<S> | undefined;

  while (!room) {
    const session = getSession();

    try {
      if (session) {
        room = await client.reconnect(session.roomId, session.sessionId);
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
  const { Vector3 } = await import("three");
  const ui = document.getElementById("ui") as HTMLElement;
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  const client = new Client(
    `ws://${(window as any).APP_CONFIGURATION.SERVER_HOST.replace(
      "localhost",
      window.location.hostname,
    )}`,
  );

  const [room] = await Promise.all([
    connect<RoomState>(
      client,
      "main",
    ),
    preload(),
  ]);
  const scene = await createScene(canvas);

  const onPlayerChange = (changes: DataChange<any>[]) => {
    const vehicleIdChange = changes.find(
      change => change.field === "vehicleId",
    );

    if (vehicleIdChange) {
      scene.setCameraTarget(room.state.entities[vehicleIdChange.value]);
    }
  };
  const onPlayerAdd = (player: Player) => {
    if (player.id === room.sessionId) {
      player.onChange = onPlayerChange;

      if (player.vehicleId) {
        scene.setCameraTarget(room.state.entities[player.vehicleId]);
      }
    }
  };
  const onEntityAdd = (entity: Entity) => scene.addObject(entity);
  const onEntityRemove = async (entity: Entity) => {
    scene.removeObject(entity);

    if (entity.type === EntityType.Ship) {
      const shipBody = Entity.getComponent(entity, Body);
      const explosion = await createExplosion(shipBody.x, shipBody.y);

      scene.addAnimation(explosion);
    }
  };

  for (const entityId in room.state.entities) {
    onEntityAdd(room.state.entities[entityId]);
  }

  for (const playerId in room.state.players) {
    onPlayerAdd(room.state.players[playerId]);
  }

  room.state.entities.onAdd = onEntityAdd;
  room.state.entities.onRemove = onEntityRemove;
  room.state.players.onAdd = onPlayerAdd;

  input.subscribe((key, value) => room.send(command(key, value)));

  window.addEventListener("mousedown", e => {
    const vec = new Vector3();
    const pos = new Vector3();
    const { x, y } = getMousePosition(e, scene.camera, vec, pos);

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

  function render(time: number) {
    scene.render(time);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  ReactDOM.render(<App room={room} />, ui);
}

main();
