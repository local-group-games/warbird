import { Ball } from "colyseus-test-core";
import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";

export function createBall(ball: Ball) {
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

  return mesh;
}
