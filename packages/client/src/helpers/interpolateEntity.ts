import { EntitySchema, BodySchema } from "colyseus-test-core";
import { Object3D, Math } from "three";

export function interpolateEntity(body: BodySchema, object: Object3D) {
  object.position.set(
    Math.lerp(object.position.x, body.x, 0.6),
    Math.lerp(object.position.y, body.y, 0.6),
    0,
  );
  object.rotation.set(0, 0, Math.lerp(object.rotation.z, body.angle, 0.75));
}
