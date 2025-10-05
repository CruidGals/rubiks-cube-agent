import { TresScene } from "@tresjs/core";
import { useRubiksCube } from "./cubeVisual";
import * as THREE from "three";
import { shallowRef } from "vue";

// Get the cubes
const { cubes } = useRubiksCube();

// Master group which contains all cubes
const masterGroup = shallowRef<THREE.Group | null>(null);

// Use an enum to denote the different faces of a Rubik's Cube
export enum CubeFace {
    R, L, U, D, F, B
}

export function useCubeLogic() {
    function grabCubesFromFace(face: CubeFace) {
        switch (face) {
            case CubeFace.R:
                return cubes.filter(cube => cube.position.x > 0.5);
            case CubeFace.L:
                return cubes.filter(cube => cube.position.x < -0.5);
            case CubeFace.U:
                return cubes.filter(cube => cube.position.y > 0.5);
            case CubeFace.D:
                return cubes.filter(cube => cube.position.y < -0.5);
            case CubeFace.F:
                return cubes.filter(cube => cube.position.z > 0.5);
            case CubeFace.B:
                return cubes.filter(cube => cube.position.z < -0.5);
        }
    }

    // Rotate a face based on the enum
    // Prime denotes if is counter clockwise (e.g. R', L', U', D', F', B')
    function rotateFace(scene: TresScene, face: CubeFace, primed: boolean = false) {
        const cubesToRotate = grabCubesFromFace(face);
        const angle = primed ? -Math.PI / 2 : Math.PI / 2;

        // Make a pivot object
        const pivot = new THREE.Object3D();
        scene.add(pivot);

        // Get the center of the rotating face
        const center = new THREE.Vector3();
        cubesToRotate.forEach(cube => {
            center.add(cube.position);
        });
        center.divideScalar(cubesToRotate.length);
        pivot.position.copy(center);

        
    }

    return { masterGroup, rotateFace };
}
