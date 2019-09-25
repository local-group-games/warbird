import { lerp, lerpAngle } from "@gamestdio/mathf";
import { Body } from "@warbird/core";
import { Object3D } from "three";

export function interpolateEntity(body: Body, object: Object3D) {
  object.position.set(
    lerp(object.position.x, body.x, 0.6),
    lerp(object.position.y, body.y, 0.6),
    0,
  );
  object.rotation.set(0, 0, lerpAngle(object.rotation.z, body.angle, 0.9));
}
