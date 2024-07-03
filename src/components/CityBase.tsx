import { MeshProps } from "@react-three/fiber";

export function CityBase(props: MeshProps) {
    return (
        <mesh {...props}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={0x555555}
                roughness={1}
                metalness={0}
            />
        </mesh>
    );
}
