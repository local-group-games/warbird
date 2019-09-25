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

export const Meters = memo((props: MetersProps) => {
  const { energy, health } = props;

  return (
    <ClassNames>
      {({ css }) => (
        <MetersWrapper>
          <Meter
            color="#88ff33"
            height={5}
            progress={health / 100}
            className={css`
              margin-bottom: 4px;
            `}
          />
          <Meter color="#3388ff" height={5} progress={energy / 100} />
        </MetersWrapper>
      )}
    </ClassNames>
  );
});
