import {
  Player,
  Ship,
  Entity,
  Destructible,
  Capacitor,
  Arsenal,
  Weapon,
} from "@warbird/core";
import { Meter, Root, ItemButton } from "@warbird/ui";
import { Room } from "colyseus.js";
import React, { useEffect, useReducer } from "react";
import { css } from "emotion";

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
        <div
          className={css`
            flex: 3;
          `}
        >
          <Meter
            color="#88ff33"
            height={5}
            progress={state.health / 100}
            className={css`
              margin-bottom: 4px;
            `}
          />
          <Meter color="#3388ff" height={5} progress={state.energy / 100} />
        </div>
        <ul
          className={css`
            list-style-type: none;
            margin: 0;
            padding: 0;
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
          `}
        >
          {state.weapons.map((weapon, i) => (
            <li key={i}>
              <ItemButton
                className={css`
                  background-color: ${state.activeWeapon === i
                    ? "#666"
                    : "#444"};
                `}
              >
                <dl
                  className={css`
                    margin: 0;

                    > dt {
                      display: none;
                    }

                    > dd {
                      display: inline-block;
                      margin: 0;
                    }

                    > dd ~ dd {
                      &:before {
                        content: "/";
                      }
                    }
                  `}
                >
                  <dt>Fire rate</dt>
                  <dd>{weapon.fireRate}</dd>
                  <dt>Energy cost</dt>
                  <dd>{weapon.energyCost}</dd>
                </dl>
              </ItemButton>
            </li>
          ))}
        </ul>
      </div>
    </Root>
  );
}
