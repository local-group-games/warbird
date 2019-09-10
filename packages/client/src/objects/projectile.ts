import { Projectile } from "colyseus-test-core";
import { CircleGeometry, Mesh, MeshStandardMaterial } from "three";
import { RenderObject } from "../types";
import { interpolateEntity } from "../helpers/interpolateEntity";

export function createProjectile(projectile: Projectile): RenderObject {
  const geometry = new CircleGeometry(projectile.width / 3, 6);
  const material = new MeshStandardMaterial({
    color: 0xefdfaa,
    emissive: 0xefdfaa,
    emissiveIntensity: 1,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = projectile.x;
  mesh.position.y = projectile.y;

  return {
    object: mesh,
    update: () => interpolateEntity(projectile, mesh),
  };
}
