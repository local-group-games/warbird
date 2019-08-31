import { Camera, Vector3 } from "three";

const vec = new Vector3();

export function getMousePosition(event: MouseEvent, camera: Camera) {
  const pos = new Vector3();

  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5,
  );

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  const distance = -camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  return pos;
}
