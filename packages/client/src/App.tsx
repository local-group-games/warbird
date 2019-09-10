import {
  ICapacitor,
  IDestructible,
  IWeaponSystem,
  Player,
  Ship,
} from "colyseus-test-core";
import { Meter, Root } from "colyseus-test-ui";
import { Room } from "colyseus.js";
import React, { useEffect, useReducer } from "react";

type AppProps = {
  room: Room;
};

type AppState = {
  playerShip: (IDestructible & ICapacitor & IWeaponSystem) | null;
};

enum AppActionTypes {
  UpdatePlayerShip,
}

type UpdatePlayerShip = {
  type: AppActionTypes.UpdatePlayerShip;
  payload: Ship;
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

type AppAction = UpdatePlayerShip;

const SHIP_CHANGE_KEYS = ["health", "energy", "activeWeapon"];

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionTypes.UpdatePlayerShip:
      return {
        ...state,
        playerShip: { ...action.payload },
      };
  }
  return state;
}

export function App(props: AppProps) {
  const [state, dispatch] = useReducer(appReducer, {
    playerShip: null,
  });

  useEffect(() => {
    function onStateChange() {
      const player: Player = props.room.state.players[props.room.sessionId];

      if (player && player.shipId) {
        const s = new Ship();
        const ship: Ship = props.room.state.entities[player.shipId];

        if (
          ship &&
          (!state.playerShip ||
            !shallowEquals(ship, state.playerShip, SHIP_CHANGE_KEYS))
        ) {
          dispatch({
            type: AppActionTypes.UpdatePlayerShip,
            payload: ship,
          });
        }
      }
    }

    props.room.onStateChange(onStateChange);

    return () => props.room.onStateChange.remove(onStateChange);
  }, [props.room, state]);

  return (
    <Root>
      {state.playerShip && (
        <>
          <Meter
            color="#88ff33"
            height={4}
            progress={state.playerShip.health / 100}
          />
          <Meter
            color="#3388ff"
            height={4}
            progress={state.playerShip.energy / 100}
          />
          <ul>
            {state.playerShip.weapons.map((weapon, i) => (
              <li key={i}>
                <span
                  style={{
                    color:
                      state.playerShip && state.playerShip.activeWeapon === i
                        ? "red"
                        : "inherit",
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
        </>
      )}
      <div>{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</div>
    </Root>
  );
}
