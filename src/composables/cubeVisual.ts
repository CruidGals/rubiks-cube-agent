import { MeshBasicMaterial, Vector3, Object3D } from "three";
import { ref } from "vue";

export function useRubiksCube() {
    // Cube positions
    const cubes = ref([]);
    const separation = 1.05;
    let id = 0;

    for (let x = -separation; x <= separation; x += separation) {
        for (let y = -separation; y <= separation; y += separation) {
            for (let z = -separation; z <= separation; z += separation) {
                // Don't include the center cube
                if (x === 0 && y === 0 && z === 0) continue;

                cubes.value.push({
                    id: id++,
                    position: new Vector3(x, y, z),
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

    function setCubeObject(id: number, obj: Object3D) {
        cubes.value[id].object = obj;
    }

    return { cubes, mats, setCubeObject };
}