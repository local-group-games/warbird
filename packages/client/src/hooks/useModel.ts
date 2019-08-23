import { useMemo } from "react";
import { Geometry, Material, Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { unstable_createResource as createResource } from "../helpers/react-cache";

const resource = createResource<string, string, GLTF>(
  (file: any) => new Promise(async res => new GLTFLoader().load(file, res)),
);

type ModelData = {
  geometry: Geometry;
  material: Material;
};

export default function useModel(file: string): [ModelData[], Vector3] {
  const { scene } = resource.read(file);
  const data = useMemo(() => {
    const temp: ModelData[] = [];

    scene.traverse(
      (child: any) =>
        child.isMesh &&
        temp.push({
          geometry: child.geometry,
          material: child.material,
        }),
    );

    return temp;
  }, [scene]);

  return [data, scene.children[0].position];
}
