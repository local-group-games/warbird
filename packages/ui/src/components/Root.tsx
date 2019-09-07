import React, { Props, PropsWithChildren, ReactNode } from "react";
import { css } from "emotion";

export function Root(props: { children: ReactNode }) {
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        position: fixed;
        pointer-events: none;
        color: #ffffff;
        font-size: 12px;
        font-family: "PragmataPro Mono", monospace;
      `}
      {...props}
    />
  );
}
