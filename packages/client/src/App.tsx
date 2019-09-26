import styled from "@emotion/styled";
import {
  Arsenal,
  Capacitor,
  Destructible,
  Entity,
  RoomState,
  Ship,
  Player,
} from "@warbird/core";
import { Root } from "@warbird/ui";
import { Room } from "colyseus.js";
import React, { useEffect, useState } from "react";
import { useComponent } from "./ui/hooks/useComponent";
import { useForceUpdate } from "./ui/hooks/useForceUpdate";
import { Items } from "./ui/Items";
import { Meters } from "./ui/Meters";

export type AppProps = {
  room: Room<RoomState>;
};

const Version = styled.div`
  flex: 1;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  flex: 1;
  pointer-events: none;
`;
const Main = styled.div`
  display: flex;
  flex: 8;
  pointer-events: none;
`;
const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  pointer-events: none;
`;

export function App(props: AppProps) {
  const forceUpdate = useForceUpdate();
  const [playerShip, setPlayerShip] = useState<Ship>();

  useEffect(() => {
    const onStateChange = () => {
      const player: Player = props.room.state.players[props.room.sessionId];

      if (!player || !player.vehicleId) return;

      const ship = props.room.state.entities[player.vehicleId];

      if (ship && ship !== playerShip) {
        setPlayerShip(ship);
      }
    };

    props.room.onStateChange(onStateChange);

    return () => props.room.onStateChange.remove(onStateChange);
  }, [props.room, forceUpdate, playerShip]);

  return (
    <Root>
      <Header />
      <Main />
      <Footer>
        <Version>{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</Version>
        {playerShip && <PlayerInfo ship={playerShip} />}
      </Footer>
    </Root>
  );
}

export type PlayerInfoProps = {
  ship: Entity;
};

const PlayerInfo = (props: PlayerInfoProps) => {
  const [{ health }, { weapons, activeWeapon }, { energy }] = useComponent(
    props.ship,
    Destructible,
    Arsenal,
    Capacitor,
  );

  return (
    <>
      <Meters health={health} energy={energy} />
      <Items weapons={weapons} activeWeapon={activeWeapon} />
    </>
  );
};
