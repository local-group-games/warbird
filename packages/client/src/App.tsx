import styled from "@emotion/styled";
import {
  Arsenal,
  Capacitor,
  Destructible,
  Entity,
  RoomState,
} from "@warbird/core";
import { Root } from "@warbird/ui";
import { Room } from "colyseus.js";
import React, { useEffect } from "react";
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

function usePlayerShip(room: Room<RoomState>): Entity | null {
  const player = room.state.players[room.sessionId];

  if (!player) return null;

  const ship = room.state.entities[player.shipId];

  return ship || null;
}

export function App(props: AppProps) {
  const forceUpdate = useForceUpdate();
  const ship = usePlayerShip(props.room);
  useEffect(() => {
    const onStateChange = () => forceUpdate();

    props.room.onStateChange(onStateChange);

    return () => props.room.onStateChange.remove(onStateChange);
  }, [props.room, forceUpdate]);

  if (!ship) {
    return null;
  }

  const { health } = Entity.getComponent(ship, Destructible);
  const { weapons, activeWeapon } = Entity.getComponent(ship, Arsenal);
  const { energy } = Entity.getComponent(ship, Capacitor);

  return (
    <Root>
      <Header />
      <Main />
      <Footer>
        <Version>{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</Version>
        <Meters health={health} energy={energy} />
        <Items weapons={weapons} activeWeapon={activeWeapon} />
      </Footer>
    </Root>
  );
}
