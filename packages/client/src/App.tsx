import { DataChange } from "@colyseus/schema";
import {
  Arsenal,
  ArsenalProps,
  Capacitor,
  CapacitorProps,
  Destructible,
  DestructibleProps,
  Entity,
  Player,
  RoomState,
  Ship,
} from "@warbird/core";
import { Root } from "@warbird/ui";
import { Room } from "colyseus.js";
import { css } from "emotion";
import React, { useEffect, useReducer, useRef } from "react";
import { Items } from "./ui/Items";
import { Meters } from "./ui/Meters";

const SHIP_CHANGE_COMPONENT_TYPES = [Arsenal, Capacitor, Destructible];

type AppProps = {
  room: Room<RoomState>;
};

type PlayerInfo = {
  capacitor: CapacitorProps;
  destructible: DestructibleProps;
  arsenal: ArsenalProps;
};

type AppState = {
  players: PlayerInfo[];
};

export function App(props: AppProps) {
  const { current: state } = useRef<any>({ entities: {}, players: [] });
  const [, forceUpdate] = useReducer((x, _: void) => x + 1, 0);

  useEffect(() => {
    props.room.onStateChange(s => {
      Object.assign(state, s);
      forceUpdate();
    });
  }, [props.room]);

  const player = state.players[props.room.sessionId];

  if (!player) return null;

  const ship = state.entities[player.shipId];

  if (!ship) return null;

  const destructible = Entity.getComponent(ship, Destructible);
  const arsenal = Entity.getComponent(ship, Arsenal);
  const capacitor = Entity.getComponent(ship, Capacitor);
  const version = (
    <div
      className={css`
        flex: 1;
        text-align: center;
      `}
    >{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</div>
  );

  return (
    <Root>
      <div
        className={css`
          flex: 1;
          pointer-events: none;
        `}
      ></div>
      <div
        className={css`
          flex: 8;
          pointer-events: none;
        `}
      ></div>
      <div
        className={css`
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;
          pointer-events: none;
        `}
      >
        {version}
        <Meters health={destructible.health} energy={capacitor.energy} />
        <Items activeWeapon={arsenal.activeWeapon} weapons={arsenal.weapons} />
      </div>
    </Root>
  );
}
