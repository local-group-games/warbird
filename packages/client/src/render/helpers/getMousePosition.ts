import { Camera, Vector3 } from "three";

export function getMousePosition(
  event: MouseEvent,
  camera: Camera,
  vec: Vector3,
  out: Vector3,
) {
  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5,
  );

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  const distance = -camera.position.z / vec.z;

  out.copy(camera.position).add(vec.multiplyScalar(distance));

  return out;
}
