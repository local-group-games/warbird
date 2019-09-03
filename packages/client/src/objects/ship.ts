import { Ship } from "colyseus-test-core";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Matrix4 } from "three";

const loader = new GLTFLoader();

const loadResource = (file: string) =>
  new Promise<GLTF>((resolve, reject) =>
    loader.load(file, resolve, () => {}, reject),
  );

export async function createShip(ship: Ship) {
  const gltf = await loadResource("/assets/models/ship/scene.gltf");
  const { scene: model } = gltf;

  model.position.x = ship.x;
  model.position.y = ship.y;
  model.scale.setScalar(0.002);

  model.traverse(child => {
    child.rotation.set(0, 0, Math.PI / -4);
  });

  model.applyMatrix(new Matrix4().makeTranslation(0, -2, 0));

  return model;
}
