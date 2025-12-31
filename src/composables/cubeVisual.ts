import { MeshBasicMaterial, Vector3, Object3D, Euler, Quaternion } from "three";
import { ref, markRaw } from "vue";

type Cube = {
    id: number;
    position: Vector3;
    object: Object3D | null;
    pieceNumber: number | null; // Corner (0-7) or Edge (0-11) number, null for centers
    isCorner: boolean;
}

// How separted the pieces are
const SEPARATION_DISTANCE = 1.05;

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

// Maps initial position to piece number based on notation.md
// Corners: 0-7 (URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB)
// Edges: 0-11 (UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR)
function getPieceNumber(x: number, y: number, z: number): { number: number | null, isCorner: boolean } {
    const s = SEPARATION_DISTANCE; // separation
    const eps = 0.01; // epsilon for comparison
    
    // Check if it's a corner (all coordinates non-zero)
    if (Math.abs(x) > eps && Math.abs(y) > eps && Math.abs(z) > eps) {
        // Corners: 0-7
        if (Math.abs(x - s) < eps && Math.abs(y - s) < eps && Math.abs(z - s) < eps) return { number: 0, isCorner: true }; // URF
        if (Math.abs(x + s) < eps && Math.abs(y - s) < eps && Math.abs(z - s) < eps) return { number: 1, isCorner: true }; // UFL
        if (Math.abs(x + s) < eps && Math.abs(y - s) < eps && Math.abs(z + s) < eps) return { number: 2, isCorner: true }; // ULB
        if (Math.abs(x - s) < eps && Math.abs(y - s) < eps && Math.abs(z + s) < eps) return { number: 3, isCorner: true }; // UBR
        if (Math.abs(x - s) < eps && Math.abs(y + s) < eps && Math.abs(z - s) < eps) return { number: 4, isCorner: true }; // DFR
        if (Math.abs(x + s) < eps && Math.abs(y + s) < eps && Math.abs(z - s) < eps) return { number: 5, isCorner: true }; // DLF
        if (Math.abs(x + s) < eps && Math.abs(y + s) < eps && Math.abs(z + s) < eps) return { number: 6, isCorner: true }; // DBL
        if (Math.abs(x - s) < eps && Math.abs(y + s) < eps && Math.abs(z + s) < eps) return { number: 7, isCorner: true }; // DRB
    }
    
    // Check if it's an edge (exactly one coordinate is zero)
    if (Math.abs(x) < eps) {
        // Edges with x=0
        if (Math.abs(y - s) < eps && Math.abs(z - s) < eps) return { number: 1, isCorner: false }; // UF
        if (Math.abs(y - s) < eps && Math.abs(z + s) < eps) return { number: 3, isCorner: false }; // UB
        if (Math.abs(y + s) < eps && Math.abs(z - s) < eps) return { number: 5, isCorner: false }; // DF
        if (Math.abs(y + s) < eps && Math.abs(z + s) < eps) return { number: 7, isCorner: false }; // DB
    }
    if (Math.abs(y) < eps) {
        // Edges with y=0
        if (Math.abs(x - s) < eps && Math.abs(z - s) < eps) return { number: 8, isCorner: false }; // FR
        if (Math.abs(x + s) < eps && Math.abs(z - s) < eps) return { number: 9, isCorner: false }; // FL
        if (Math.abs(x + s) < eps && Math.abs(z + s) < eps) return { number: 10, isCorner: false }; // BL
        if (Math.abs(x - s) < eps && Math.abs(z + s) < eps) return { number: 11, isCorner: false }; // BR
    }
    if (Math.abs(z) < eps) {
        // Edges with z=0
        if (Math.abs(x - s) < eps && Math.abs(y - s) < eps) return { number: 0, isCorner: false }; // UR
        if (Math.abs(x + s) < eps && Math.abs(y - s) < eps) return { number: 2, isCorner: false }; // UL
        if (Math.abs(x - s) < eps && Math.abs(y + s) < eps) return { number: 4, isCorner: false }; // DR
        if (Math.abs(x + s) < eps && Math.abs(y + s) < eps) return { number: 6, isCorner: false }; // DL
    }
    
    // Center piece (two coordinates zero)
    return { number: null, isCorner: false };
}

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
    let id = 0;

    for (let x = -SEPARATION_DISTANCE; x <= SEPARATION_DISTANCE; x += SEPARATION_DISTANCE) {
        for (let y = -SEPARATION_DISTANCE; y <= SEPARATION_DISTANCE; y += SEPARATION_DISTANCE) {
            for (let z = -SEPARATION_DISTANCE; z <= SEPARATION_DISTANCE; z += SEPARATION_DISTANCE) {
                // Don't include the center cube
                if (x === 0 && y === 0 && z === 0) continue;                

                const pieceInfo = getPieceNumber(x, y, z);
                meshes.value.push({
                    cube: {
                        id: id, 
                        position: markRaw(new Vector3(x, y, z)), 
                        object: null as Object3D | null, /* will be set later when mesh is created */
                        pieceNumber: pieceInfo.number,
                        isCorner: pieceInfo.isCorner
                    },
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