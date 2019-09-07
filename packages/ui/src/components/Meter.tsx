import React from "react";
import styled from "styled-components";

type WrapperProps = {
  height: number;
  className?: string;
};

type BarProps = {
  color: string;
  progress: number;
};

export type MeterProps = WrapperProps & BarProps;

const Wrapper = styled.div`
  display: flex;
  height: ${(props: WrapperProps) => props.height}px;
`;

const Bar = styled.div`
  width: ${(props: BarProps) => props.progress * 100}%;
  height: 100%;
  background-color: ${(props: BarProps) => props.color};
`;

export function Meter(props: MeterProps) {
  const { color, height, progress, className } = props;

  return (
    <Wrapper height={height} className={className}>
      <Bar color={color} progress={progress} />
    </Wrapper>
  );
}
