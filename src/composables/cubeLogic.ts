import { TresScene } from "@tresjs/core";
import { cubes } from "./cubeVisual";
import * as THREE from "three";
import { shallowRef } from "vue";

// Master group which contains all cubes
const masterGroup = shallowRef<THREE.Group | null>(null);

// Use an enum to denote the different faces of a Rubik's Cube
export enum CubeFace {
    R, L, U, D, F, B, M, S, E
}

export function useCubeLogic() {
    function grabCubesFromFace(face: CubeFace) {
        switch (face) {
            case CubeFace.R:
                return cubes.value.filter(cube => cube.position.x > 0.5);
            case CubeFace.L:
                return cubes.value.filter(cube => cube.position.x < -0.5);
            case CubeFace.U:
                return cubes.value.filter(cube => cube.position.y > 0.5);
            case CubeFace.D:
                return cubes.value.filter(cube => cube.position.y < -0.5);
            case CubeFace.F:
                return cubes.value.filter(cube => cube.position.z > 0.5);
            case CubeFace.B:
                return cubes.value.filter(cube => cube.position.z < -0.5);
            case CubeFace.M:
                return cubes.value.filter(cube => cube.position.x === 0.0);
            case CubeFace.S:
                return cubes.value.filter(cube => cube.position.z === 0.0);
            case CubeFace.E:
                return cubes.value.filter(cube => cube.position.y === 0.0);
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

        const cubes = grabCubesFromFace(face);
        const cubesToRotate = cubes.map(cube => cube.object);
        let angle = primed ? Math.PI / 2 : -Math.PI / 2;

        // Check if any cubes are null
        if (cubesToRotate.includes(null)) {
            console.log(cubesToRotate);
            console.warn("Some cubes are not yet initialized");
            return;
        }

        // Flip angle if face is L, D, or B to maintain correct direction
        if (face === CubeFace.L || face === CubeFace.D || face === CubeFace.B || face === CubeFace.M) angle *= -1;

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
            face === CubeFace.R || face === CubeFace.L || face === CubeFace.M ? 1 : 0,
            face === CubeFace.U || face === CubeFace.D || face === CubeFace.E ? 1 : 0,
            face === CubeFace.F || face === CubeFace.B || face === CubeFace.S ? 1 : 0
        );
        pivot.rotateOnAxis(axis, angle);

        // Detach cubes from pivot
        cubesToRotate.forEach(cube => {
            masterGroup.value?.attach(cube);
        });

        // Set new positions accordingly
        for (let i = 0; i < cubes.length; i++) {
            cubes[i].position.copy(cubesToRotate[i]!.position);

            // Round to avoid floating point errors (set it to both position variables)
            cubes[i].position.x = Math.round(cubes[i].position.x * 100) / 100;
            cubesToRotate[i]!.position.x = cubes[i].position.x;
            cubes[i].position.y = Math.round(cubes[i].position.y * 100) / 100;
            cubesToRotate[i]!.position.y = cubes[i].position.y;
            cubes[i].position.z = Math.round(cubes[i].position.z * 100) / 100;
            cubesToRotate[i]!.position.z = cubes[i].position.z;
        }

        // Remove pivot from scene
        pivot.removeFromParent();
        pivot.clear();
    }

    return { masterGroup, rotateFace };
}
