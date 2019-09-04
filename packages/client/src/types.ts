import { Object3D } from "three";

export type Animation = {
  object: Object3D;
  start: number;
  duration: number;
  update: () => void;
};
