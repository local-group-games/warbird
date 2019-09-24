import {
  Player,
  Ship,
  Entity,
  Destructible,
  Capacitor,
  Arsenal,
  Weapon,
} from "@warbird/core";
import { Meter, Root } from "@warbird/ui";
import { Room } from "colyseus.js";
import React, { useEffect, useReducer } from "react";

type AppProps = {
  room: Room;
};

type AppState = {
  energy: number;
  health: number;
  weapons: Weapon[];
  activeWeapon: number;
};

enum AppActionTypes {
  UpdatePlayerInfo,
}

type UpdatePlayerInfo = {
  type: AppActionTypes.UpdatePlayerInfo;
  payload: {
    energy: number;
    health: number;
    weapons: Weapon[];
    activeWeapon: number;
  };
};

function shallowEquals(
  a: { [key: string]: any },
  b: { [key: string]: any },
  keys?: string[],
) {
  for (const key in a) {
    if (b[key] !== a[key] && (!keys || keys.indexOf(key) > -1)) {
      return false;
    }
  }

  return true;
}

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

export function App(props: AppProps) {
  const [state, dispatch] = useReducer(appReducer, {
    energy: 0,
    health: 0,
    weapons: [],
    activeWeapon: -1,
  });
  const updatePlayerShip = (
    energy: number,
    health: number,
    weapons: Weapon[],
    activeWeapon: number,
  ) =>
    dispatch({
      type: AppActionTypes.UpdatePlayerInfo,
      payload: {
        energy,
        health,
        weapons,
        activeWeapon,
      },
    });

  useEffect(() => {
    function onStateChange() {
      const player: Player = props.room.state.players[props.room.sessionId];

      if (player && player.shipId) {
        const ship: Ship = props.room.state.entities[player.shipId];
        const capacitor = Entity.getComponent(ship, Capacitor);
        const destructible = Entity.getComponent(ship, Destructible);
        const arsenal = Entity.getComponent(ship, Arsenal);
        const onChange = () =>
          updatePlayerShip(
            capacitor.energy,
            destructible.health,
            arsenal.weapons,
            arsenal.activeWeapon,
          );

        destructible.onChange = onChange;
        capacitor.onChange = onChange;
        arsenal.onChange = onChange;
      }
    }

    props.room.onStateChange(onStateChange);

    return () => props.room.onStateChange.remove(onStateChange);
  }, [props.room]);

  return (
    <Root>
      <Meter color="#88ff33" height={4} progress={state.health / 100} />
      <Meter color="#3388ff" height={4} progress={state.energy / 100} />
      <ul>
        {state.weapons.map((weapon, i) => (
          <li key={i}>
            <span
              style={{
                color: state.activeWeapon === i ? "red" : "inherit",
              }}
            >
              Weapon {i}
            </span>
            <dl>
              <dt>Fire rate</dt>
              <dd>{weapon.fireRate}</dd>
            </dl>
            <dl>
              <dt>Energy cost</dt>
              <dd>{weapon.energyCost}</dd>
            </dl>
          </li>
        ))}
      </ul>
      <div>{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</div>
    </Root>
  );
}
