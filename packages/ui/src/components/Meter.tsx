import React from "react";
import { css, cx } from "emotion";

type WrapperProps = {
  height: number;
  className?: string;
};

type BarProps = {
  color: string;
  progress: number;
};

export type MeterProps = WrapperProps & BarProps;

export function Meter(props: MeterProps) {
  const { color, height, progress, className } = props;

  return (
    <div
      className={cx(
        className,
        css`
          display: flex;
          height: ${props.height}px;
        `,
      )}
    >
      <div
        className={css`
          width: ${props.progress * 100}%;
          height: 100%;
          background-color: ${props.color};
        `}
      />
    </div>
  );
}
