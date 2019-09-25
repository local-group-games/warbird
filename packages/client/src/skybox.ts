import { createStarFieldTexture } from "./textures/stars";

export async function createSkyBox() {
  const {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    BackSide,
    Mesh,
    Texture,
  } = await import("three");
  const scene = new Scene();
  const outerBox = new BoxGeometry(160, 160, 160);
  const innerBox = new BoxGeometry(60, 60, 60);
  const outerTexture = new Texture(createStarFieldTexture(600));
  const innerTexture = new Texture(createStarFieldTexture(1000));
  const outerMaterial = new MeshBasicMaterial({
    map: outerTexture,
    side: BackSide,
    transparent: true,
    depthWrite: false,
  });
  const innerMaterial = new MeshBasicMaterial({
    map: innerTexture,
    side: BackSide,
    transparent: true,
    depthWrite: false,
  });
  const outer = new Mesh(outerBox, outerMaterial);
  const inner = new Mesh(innerBox, innerMaterial);

  scene.add(outer);
  scene.add(inner);

  outerTexture.needsUpdate = true;
  innerTexture.needsUpdate = true;

  return scene;
}
