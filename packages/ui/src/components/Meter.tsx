import styled from "@emotion/styled";
import React from "react";
import { animated, useSpring } from "react-spring";

type MeterWrapperProps = {
  height: number;
  className?: string;
};

export type MeterProps = MeterWrapperProps & {
  color: string;
  progress: number;
};

const MeterWrapper = styled.div<MeterWrapperProps>`
  display: flex;
  height: ${props => props.height}px;
`;

export function Meter(props: MeterProps) {
  const { color, height, progress, className } = props;
  const x = useSpring({
    width: `${progress * 100}%`,
    backgroundColor: color,
    height: "100%",
  });

  return (
    <MeterWrapper height={height} className={className}>
      <animated.div style={x} />
    </MeterWrapper>
  );
}
