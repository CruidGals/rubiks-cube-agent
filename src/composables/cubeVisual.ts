import { MeshBasicMaterial, Vector3, Object3D, Euler } from "three";
import { ref, markRaw } from "vue";

export const cubes = ref<{ id: number; position: Vector3; object: Object3D | null }[]>([]);

// Naming schemes
interface FaceSymbolEntity {
    symbol: string,
    position: Vector3,
    rotation: Euler
}

export const faceSymbols: FaceSymbolEntity[] = [
    { symbol: "F", position: new Vector3(0,0,2), rotation: new Euler(0,0,0) },
    { symbol: "R", position: new Vector3(2,0,0), rotation: new Euler(0,Math.PI / 2,0) },
    { symbol: "B", position: new Vector3(0,0,-2), rotation: new Euler(0,Math.PI,0) },
    { symbol: "L", position: new Vector3(-2,0,0), rotation: new Euler(0,(-Math.PI) / 2,0) },
    { symbol: "U", position: new Vector3(0,2,0), rotation: new Euler((-Math.PI) / 2,0,0) },
    { symbol: "D", position: new Vector3(0,-2,0), rotation: new Euler((-Math.PI) / 2,0,0) },
]

export const showFaceSymbols = ref(true);

export function useRubiksCube() {
    // Cube positions
    const separation = 1.05;
    let id = 0;

    for (let x = -separation; x <= separation; x += separation) {
        for (let y = -separation; y <= separation; y += separation) {
            for (let z = -separation; z <= separation; z += separation) {
                // Don't include the center cube
                if (x === 0 && y === 0 && z === 0) continue;

                cubes.value.push({
                    id: id++,
                    position: markRaw(new Vector3(x, y, z)),
                    object: null as Object3D | null // will be set later when mesh is created
                });
            }
        }
    }

    // Define material
    const mats = [
    new MeshBasicMaterial({ color: 0xff0000 }), // +X
    new MeshBasicMaterial({ color: 0xffa500 }), // -X
    new MeshBasicMaterial({ color: 0xffffff }), // +Y
    new MeshBasicMaterial({ color: 0xffff00 }), // -Y
    new MeshBasicMaterial({ color: 0x008000 }), // +Z
    new MeshBasicMaterial({ color: 0x0000ff })  // -Z
    ];

    function setCubeObject(id: number, obj) {
        cubes.value[id].object = obj;
    }

    return { cubes, mats, faceSymbols, showFaceSymbols, setCubeObject };
}