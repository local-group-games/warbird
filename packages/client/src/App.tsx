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
import React, { useEffect, useReducer } from "react";
import { Items } from "./ui/Items";
import { Meters } from "./ui/Meters";

type AppProps = {
  room: Room<RoomState>;
};

type AppState = {
  capacitor: CapacitorProps;
  destructible: DestructibleProps;
  arsenal: ArsenalProps;
};

enum AppActionTypes {
  UpdatePlayerInfo,
}

type UpdatePlayerInfo = {
  type: AppActionTypes.UpdatePlayerInfo;
  payload: {
    capacitor: CapacitorProps;
    destructible: DestructibleProps;
    arsenal: ArsenalProps;
  };
};

type AppAction = UpdatePlayerInfo;

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionTypes.UpdatePlayerInfo:
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
}

function updatePlayerInfo(
  capacitor: CapacitorProps,
  destructible: DestructibleProps,
  arsenal: Arsenal,
): UpdatePlayerInfo {
  return {
    type: AppActionTypes.UpdatePlayerInfo,
    payload: {
      capacitor,
      destructible,
      arsenal,
    },
  };
}

export function App(props: AppProps) {
  const [state, dispatch] = useReducer(appReducer, {
    capacitor: {
      energy: 0,
      energyPerS: 0,
    },
    destructible: {
      health: 0,
      invulnerable: false,
    },
    arsenal: {
      weapons: [],
      activeWeapon: -1,
    },
  });

  useEffect(() => {
    let player: Player;
    let arsenal: Arsenal;
    let capacitor: Capacitor;
    let destructible: Destructible;

    function onComponentChange() {
      dispatch(updatePlayerInfo(capacitor, destructible, arsenal));
    }

    function subscribeToPlayerShip(ship: Ship) {
      arsenal = Entity.getComponent(ship, Arsenal);
      capacitor = Entity.getComponent(ship, Capacitor);
      destructible = Entity.getComponent(ship, Destructible);

      destructible.onChange = onComponentChange;
      capacitor.onChange = onComponentChange;
      arsenal.onChange = onComponentChange;
    }

    function onPlayerAdd(p: Player) {
      if (p.id === props.room.sessionId) {
        player = p;
        player.onChange = onPlayerChange;

        if (player.shipId) {
          const ship: Ship = props.room.state.entities[player.shipId];

          if (ship) {
            subscribeToPlayerShip(ship);
          }
        }
      }
    }

    function onPlayerChange(changes: DataChange<any>[]) {
      const shipIdChange = changes.find(change => change.field === "shipId");

      if (shipIdChange) {
        const ship: Ship = props.room.state.entities[shipIdChange.value];

        if (ship) {
          subscribeToPlayerShip(ship);
        }
      }
    }

    props.room.state.players.onAdd = onPlayerAdd;

    for (const playerId in props.room.state.players) {
      onPlayerAdd(props.room.state.players[playerId]);
    }

    return () => {
      delete props.room.state.players.onAdd;
      delete player.onChange;
      delete arsenal.onChange;
      delete capacitor.onChange;
      delete destructible.onChange;
    };
  }, [props.room]);

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
        <div
          className={css`
            flex: 1;
            text-align: center;
          `}
        >{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</div>
        <Meters
          health={state.destructible.health}
          energy={state.capacitor.energy}
        />
        <Items
          activeWeapon={state.arsenal.activeWeapon}
          weapons={state.arsenal.weapons}
        />
      </div>
    </Root>
  );
}
