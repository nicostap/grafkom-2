import { useThree } from "@react-three/fiber";
import { CubeTextureLoader } from "three";

export function SkyBox() {
    const { scene } = useThree();
    const loader = new CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
        "/sky/1.jpg",
        "/sky/2.jpg",
        "/sky/3.jpg",
        "/sky/1.jpg",
        "/sky/2.jpg",
        "/sky/3gi.jpg",
    ]);

    // Set the scene background property to the resulting texture.
    scene.background = texture;
    return null;
}
