import { MeshProps } from "@react-three/fiber";

export function CityBase(props: MeshProps) {
    return (
        <mesh {...props}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={[0.5, 0.5, 0.5]} />
        </mesh>
    );
}
