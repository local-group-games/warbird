import { Body, Bullet, Entity } from "@warbird/core";
import { CircleGeometry, Mesh, MeshStandardMaterial } from "three";
import { interpolateEntity } from "../helpers/interpolateEntity";
import { RenderObject } from "../types";

export function createProjectile(bullet: Bullet): RenderObject {
  const body = Entity.getComponent(bullet, Body);
  const geometry = new CircleGeometry(body.width / 3, 6);
  const material = new MeshStandardMaterial({
    color: 0xefdfaa,
    emissive: 0xefdfaa,
    emissiveIntensity: 1,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = body.x;
  mesh.position.y = body.y;

  return {
    object: mesh,
    update: () => interpolateEntity(body, mesh),
  };
}
