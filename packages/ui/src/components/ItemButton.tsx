import React from "react";
import { css, cx } from "emotion";

export type ItemButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export function ItemButton(props: ItemButtonProps) {
  return (
    <div
      className={cx(
        props.className,
        css`
          border-radius: 50%;
          width: 30px;
          height: 30px;
          padding: 8px;
          line-height: 30px;
          text-align: center;
        `,
      )}
    >
      {props.children}
    </div>
  );
}
