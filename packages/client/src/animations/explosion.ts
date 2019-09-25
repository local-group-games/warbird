import { Geometry } from "three";
import { Animation } from "../types";

const speed = 1;
const count = 100;
const size = 0.12;
const color = 0xffffdd;

export async function createExplosion(
  x: number,
  y: number,
  duration: number,
): Promise<Animation> {
  const { Geometry, Vector3, Points, PointsMaterial } = await import("three");
  const paths: any = [];
  const geometry = new Geometry();
  const start = performance.now();

  for (let i = 0; i < count; i++) {
    const vertex = new Vector3();

    vertex.x = x;
    vertex.y = y;
    vertex.z = 0;

    geometry.vertices.push(vertex);

    paths.push(
      new Vector3(
        Math.random() * speed - speed / 2,
        Math.random() * speed - speed / 2,
        Math.random() * speed - speed / 2,
      ),
    );
  }
  const material = new PointsMaterial({
    size,
    color,
    transparent: true,
  });
  const object = new Points(geometry, material);

  object.renderOrder = -1;

  return {
    object,
    start,
    duration,
    update() {
      let c = count;
      const time = performance.now();

      while (c--) {
        const particle = (object.geometry as Geometry).vertices[c];

        particle.add(paths[c]);
      }

      material.opacity = 1 - (time - start) / duration;
      (object.geometry as Geometry).verticesNeedUpdate = true;
    },
  };
}
