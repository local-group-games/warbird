import { createContext } from "react";
import { Weapon } from "@warbird/core";

type GameContext = {
  player: {
    energy: number;
    health: number;
    weapons: Weapon[];
    activeWeapon: number;
  };
};

const gameContext = createContext<GameContext>({
  player: {
    energy: 0,
    health: 0,
    weapons: [],
    activeWeapon: -1,
  },
});
