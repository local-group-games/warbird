import React from "react";
import { css } from "emotion";
import { Meter } from "@warbird/ui";

export type MetersProps = {
  health: number;
  energy: number;
};

export function Meters(props: MetersProps) {
  return (
    <div
      className={css`
        flex: 3;
      `}
    >
      <Meter
        color="#88ff33"
        height={5}
        progress={props.health / 100}
        className={css`
          margin-bottom: 4px;
        `}
      />
      <Meter color="#3388ff" height={5} progress={props.energy / 100} />
    </div>
  );
}
