import { TresScene } from "@tresjs/core";
import { cubes } from "./cubeVisual";
import * as THREE from "three";
import { shallowRef } from "vue";

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
                return cubes.value.filter(cube => cube.position.x > 0.5).map(cube => cube.object);
            case CubeFace.L:
                return cubes.value.filter(cube => cube.position.x < -0.5).map(cube => cube.object);
            case CubeFace.U:
                return cubes.value.filter(cube => cube.position.y > 0.5).map(cube => cube.object);
            case CubeFace.D:
                return cubes.value.filter(cube => cube.position.y < -0.5).map(cube => cube.object);
            case CubeFace.F:
                return cubes.value.filter(cube => cube.position.z > 0.5).map(cube => cube.object);
            case CubeFace.B:
                return cubes.value.filter(cube => cube.position.z < -0.5).map(cube => cube.object);
        }
    }

    // Rotate a face based on the enum
    // Prime denotes if is counter clockwise (e.g. R', L', U', D', F', B')
    function rotateFace(scene: TresScene, face: CubeFace, primed: boolean = false) {
        
        // Make sure there aren't any missing values
        if (!scene || !masterGroup.value) {
            console.warn("Scene or master group not ready");
            return;
        }

        const cubesToRotate = grabCubesFromFace(face);
        let angle = primed ? -Math.PI / 2 : Math.PI / 2;

        // Check if any cubes are null
        if (cubesToRotate.includes(null)) {
            console.log(cubesToRotate);
            console.warn("Some cubes are not yet initialized");
            return;
        }

        // Flip angle if face is L, D, or B to maintain correct direction
        if (face === CubeFace.L || face === CubeFace.D || face === CubeFace.B) angle *= -1;

        // Make a pivot object
        const pivot = new THREE.Object3D();
        masterGroup.value.add(pivot);

        // Get the center of the rotating face
        const center = new THREE.Vector3();
        cubesToRotate.forEach(cube => {
            center.add(cube.position);
        });
        center.divideScalar(cubesToRotate.length);
        pivot.position.copy(center);

        // Attach cubes onto new pivot group
        cubesToRotate.forEach(cube => {
            pivot.attach(cube);
        });

        // Get axis of rotation and rotate
        const axis = new THREE.Vector3(
            face === CubeFace.R || face === CubeFace.L ? 1 : 0,
            face === CubeFace.U || face === CubeFace.D ? 1 : 0,
            face === CubeFace.F || face === CubeFace.B ? 1 : 0
        );
        pivot.rotateOnAxis(axis, angle);

        // Detach cubes from pivot
        cubesToRotate.forEach(cube => {
            masterGroup.value?.attach(cube);
        });

        // Remove pivot from scene
        pivot.removeFromParent();
        pivot.clear();
    }

    return { masterGroup, rotateFace };
}
