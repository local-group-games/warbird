import styled from "@emotion/styled";
import { Weapon } from "@warbird/core";
import { ItemButton } from "@warbird/ui";
import React, { memo } from "react";

export type ItemsProps = {
  weapons: Weapon[];
  activeWeapon: number;
};

const ItemList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const WeaponContentWrapper = styled.dl`
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
`;

type WeaponContentProps = {
  weapon: Weapon;
};

function WeaponContent(props: WeaponContentProps) {
  const { weapon } = props;

  return (
    <WeaponContentWrapper>
      <dt>Fire rate</dt>
      <dd>{weapon.fireRate}</dd>
      <dt>Energy cost</dt>
      <dd>{weapon.energyCost}</dd>
    </WeaponContentWrapper>
  );
}

export const Items = memo((props: ItemsProps) => {
  const { weapons, activeWeapon } = props;

  return (
    <ItemList>
      {weapons.map((weapon, i) => (
        <li key={i}>
          <ItemButton backgroundColor={activeWeapon === i ? "#666" : "#444"}>
            <WeaponContent weapon={weapon} />
          </ItemButton>
        </li>
      ))}
    </ItemList>
  );
});
