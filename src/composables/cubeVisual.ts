import { MeshBasicMaterial, Vector3, Object3D, Euler, Quaternion } from "three";
import { ref, markRaw } from "vue";

type Cube = {
    id: number;
    position: Vector3;
    object: Object3D | null;
}

export const meshes = ref<{cube: Cube; mats: MeshBasicMaterial[]}[]>([]);
export const originState = ref<{ id: number; position: Vector3, rotation: Euler, quaternion: Quaternion }[]>([]);
let originSet = false;

// Naming schemes
interface FaceSymbolEntity {
    symbol: string,
    position: Vector3,
    rotation: Euler
}

export const faceSymbols: FaceSymbolEntity[] = [
    { symbol: "F", position: new Vector3(0,0,1.5), rotation: new Euler(0,0,0) },
    { symbol: "R", position: new Vector3(1.5,0,0), rotation: new Euler(0,Math.PI / 2,0) },
    { symbol: "B", position: new Vector3(0,0,-1.5), rotation: new Euler(0,Math.PI,0) },
    { symbol: "L", position: new Vector3(-1.5,0,0), rotation: new Euler(0,(-Math.PI) / 2,0) },
    { symbol: "U", position: new Vector3(0,1.5,0), rotation: new Euler(Math.PI / 2,0,Math.PI) },
    { symbol: "D", position: new Vector3(0,-1.5,0), rotation: new Euler(Math.PI / 2,0,0) },
]

export const showFaceSymbols = ref(true);

// Gives the correct material based on position of cubies
function populateMaterial(x: number, y: number, z: number) {
    let mats: MeshBasicMaterial[] = [];

    mats.push(x > 0.0 ? new MeshBasicMaterial({ color: 0xff0000 }) : new MeshBasicMaterial({ color: 0x000000 }));
    mats.push(x < 0.0 ? new MeshBasicMaterial({ color: 0xffa500 }) : new MeshBasicMaterial({ color: 0x000000 }));
    mats.push(y > 0.0 ? new MeshBasicMaterial({ color: 0xffffff }) : new MeshBasicMaterial({ color: 0x000000 }));
    mats.push(y < 0.0 ? new MeshBasicMaterial({ color: 0xffff00 }) : new MeshBasicMaterial({ color: 0x000000 }));
    mats.push(z > 0.0 ? new MeshBasicMaterial({ color: 0x008000 }) : new MeshBasicMaterial({ color: 0x000000 }));
    mats.push(z < 0.0 ? new MeshBasicMaterial({ color: 0x0000ff }) : new MeshBasicMaterial({ color: 0x000000 }));

    return mats;
}

export function useRubiksCube() {
    // Cube positions
    const separation = 1.05;
    let id = 0;

    for (let x = -separation; x <= separation; x += separation) {
        for (let y = -separation; y <= separation; y += separation) {
            for (let z = -separation; z <= separation; z += separation) {
                // Don't include the center cube
                if (x === 0 && y === 0 && z === 0) continue;                

                meshes.value.push({
                    cube: {id: id, position: markRaw(new Vector3(x, y, z)), object: null as Object3D | null /* will be set later when mesh is created */ },
                    mats: populateMaterial(x, y, z)
                });

                originState.value.push({
                    id: id++,
                    position: markRaw(new Vector3(x, y, z)),
                    rotation: markRaw(new Euler()),
                    quaternion: markRaw(new Quaternion())
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
        meshes.value[id].cube.object = obj;

        if (originSet) return;

        // Set the origin states for each cube
        originState.value[id].position = new Vector3(...obj.position);
        originState.value[id].rotation = new Euler(...obj.rotation);
        originState.value[id].quaternion = new Quaternion(...obj.quaternion);
        originSet = true;
    }

    return { meshes, faceSymbols, showFaceSymbols, setCubeObject };
}

export function resetCube() {
    // Move each cubie back to its origin state
    for (let i = 0; i < meshes.value.length; i++ ) {
        // Set the logical position
        meshes.value[i].cube.position.copy(originState.value[i].position);

        // Set actual Object3D positions
        meshes.value[i].cube.object.position.copy(originState.value[i].position);
        meshes.value[i].cube.object.rotation.copy(originState.value[i].rotation);
        meshes.value[i].cube.object.quaternion.copy(originState.value[i].quaternion);
    }
}