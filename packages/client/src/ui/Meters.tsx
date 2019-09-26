import { ClassNames } from "@emotion/core";
import styled from "@emotion/styled";
import { Meter } from "@warbird/ui";
import React, { memo } from "react";

export type MetersProps = {
  health: number;
  energy: number;
};

const MetersWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

function getHealthColor(value: number) {
  var hue = (value * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

export const Meters = memo((props: MetersProps) => {
  const { energy, health } = props;
  const percentHealth = health / 100;
  const percentEnergy = energy / 100;

  return (
    <ClassNames>
      {({ css }) => (
        <MetersWrapper>
          <Meter
            color={getHealthColor(percentHealth)}
            height={5}
            progress={percentHealth}
            className={css`
              margin-bottom: 4px;
            `}
          />
          <Meter color="#3388ff" height={5} progress={percentEnergy} />
        </MetersWrapper>
      )}
    </ClassNames>
  );
});
