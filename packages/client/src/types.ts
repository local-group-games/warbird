import { Object3D } from "three";

export type RenderObject = {
  object: Object3D;
  update: (deltaTimeMs: number) => void;
};

export type Animation = RenderObject & {
  start: number;
  duration: number;
};
