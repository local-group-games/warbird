import { BallSchema } from "colyseus-test-core";
import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import { interpolateEntity } from "../helpers/interpolateEntity";
import { RenderObject } from "../types";

export function createBall(ball: BallSchema): RenderObject {
  const geometry = new SphereGeometry(ball.width / 2, 10, 10);
  const material = new MeshStandardMaterial({
    color: "#fff",
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = ball.x;
  mesh.position.y = ball.y;
  material.metalness = 0.4;
  material.roughness = 0.7;
  material.wireframe = true;

  return {
    object: mesh,
    update: () => interpolateEntity(ball, mesh),
  };
}