import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import manager from "../loading";

export class GLTFObject {
  static loader = new GLTFLoader(manager);
  static scene: THREE.Scene;
  static renderer: THREE.WebGLRenderer;
  static camera: THREE.Camera;
  object: THREE.Group<THREE.Object3DEventMap> | undefined;

  constructor(
    url: string,
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    scale: THREE.Vector3,
    callback = () => {}
  ) {
    GLTFObject.loader.load(url, async (gltf) => {
      gltf.scene.traverse( (child) => {
        if ((<THREE.Mesh> child).isMesh) {
          child.receiveShadow = true;
        }
      });
      const model = gltf.scene;
      await GLTFObject.renderer.compileAsync(
        model,
        GLTFObject.camera,
        GLTFObject.scene
      );
      GLTFObject.scene.add(model);
      GLTFObject.renderer.render(GLTFObject.scene, GLTFObject.camera);
      this.object = model;
      this.object.position.set(position.x, position.y, position.z);
      this.object.rotation.set(rotation.x, rotation.y, rotation.z);
      this.object.scale.set(scale.x, scale.y, scale.z);
      callback();
    });
  }
}
