import { Player, Ship } from "colyseus-test-core";
import { Meter, Root } from "colyseus-test-ui";
import { Room } from "colyseus.js";
import React, { useEffect, useReducer } from "react";

type AppProps = {
  room: Room;
};

type AppState = {
  playerHealth: number;
  playerEnergy: number;
};

enum AppActionTypes {
  UpdatePlayer,
}

type UpdatePlayer = {
  type: AppActionTypes.UpdatePlayer;
  payload: { playerHealth: number; playerEnergy: number };
};

type AppAction = UpdatePlayer;

function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case AppActionTypes.UpdatePlayer:
      return {
        ...state,
        playerHealth: action.payload.playerHealth,
        playerEnergy: action.payload.playerEnergy,
      };
  }
  return state;
}

export function App(props: AppProps) {
  const [state, dispatch] = useReducer(appReducer, {
    playerHealth: 0,
    playerEnergy: 0,
  });
  function onStateChange() {
    const player: Player = props.room.state.players[props.room.sessionId];

    if (player && player.shipId) {
      const ship: Ship = props.room.state.entities[player.shipId];

      if (
        ship &&
        (ship.health !== state.playerHealth ||
          ship.energy !== state.playerEnergy)
      ) {
        dispatch({
          type: AppActionTypes.UpdatePlayer,
          payload: { playerEnergy: ship.energy, playerHealth: ship.health },
        });
      }
    }
  }

  useEffect(() => {
    props.room.onStateChange(onStateChange);

    return () => props.room.onStateChange.remove(onStateChange);
  }, [props.room]);

  return (
    <Root>
      <Meter color="#88ff33" height={4} progress={state.playerHealth / 100} />
      <Meter color="#3388ff" height={4} progress={state.playerEnergy / 100} />
      <div>{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</div>
    </Root>
  );
}
