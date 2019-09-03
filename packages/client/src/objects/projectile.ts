import { Projectile } from "colyseus-test-core";
import { CircleGeometry, Mesh, MeshStandardMaterial } from "three";

export function createProjectile(projectile: Projectile) {
  const geometry = new CircleGeometry(projectile.width / 3, 6);
  const material = new MeshStandardMaterial({
    color: 0xefdfaa,
    emissive: 0xefdfaa,
    emissiveIntensity: 1,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = projectile.x;
  mesh.position.y = projectile.y;

  return mesh;
}
