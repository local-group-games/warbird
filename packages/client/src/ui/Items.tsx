import { WeaponProps } from "@warbird/core";
import { ItemButton } from "@warbird/ui";
import { css } from "emotion";
import React from "react";

export type ItemsProps = {
  activeWeapon: number;
  weapons: WeaponProps[];
};

export function Items(props: ItemsProps) {
  return (
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
      {props.weapons.map((weapon, i) => (
        <li key={i}>
          <ItemButton
            className={css`
              background-color: ${props.activeWeapon === i ? "#666" : "#444"};
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
  );
}
