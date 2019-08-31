import React, { forwardRef, useMemo } from "react";
import { Sprite, Vector3 } from "three";

type TextProps = {
  children: string;
  position: Vector3;
  opacity?: number;
  color?: string;
  fontSize?: number;
  visible?: boolean;
};

export const Text = forwardRef<Sprite, TextProps>(
  (
    {
      children,
      position,
      opacity = 1,
      color = "white",
      fontSize = 100,
      visible = true,
    }: TextProps,
    ref,
  ) => {
    const scale = 10;
    const canvas = useMemo(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = canvas.height = 2048;

      if (context) {
        context.font = `bold ${fontSize}px PragmataPro Mono Liga`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = color;
        context.fillText(children, 1024, 1024 - fontSize / 2);
      }

      return canvas;
    }, [children, color, fontSize]);

    return (
      <sprite
        scale={[scale, scale, 1]}
        position={position}
        ref={ref}
        visible={visible}
      >
        <spriteMaterial attach="material" transparent opacity={opacity}>
          <canvasTexture
            attach="map"
            image={canvas}
            premultiplyAlpha
            onUpdate={s => (s.needsUpdate = true)}
          />
        </spriteMaterial>
      </sprite>
    );
  },
);
