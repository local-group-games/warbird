import { useMemo } from "react";
import { unstable_createResource as createResource } from "../helpers/react-cache";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Geometry, Material } from "three";

// @ts-ignore
const resource = createResource(
  (file: any) => new Promise(async res => new GLTFLoader().load(file, res)),
);

export default function useModel(
  file: any,
): [
  {
    geometry: Geometry;
    material: Material;
  }[],
  number
] {
  const { scene } = resource.read(file);
  const data = useMemo(() => {
    const temp: any = [];
    scene.traverse((child: any) => {
      child.isMesh &&
        temp.push({
          geometry: child.geometry,
          material: child.material,
        });
    });
    return temp;
  }, [scene]);

  return [data, scene.children[0].position];
}
