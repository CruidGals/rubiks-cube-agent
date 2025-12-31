import { meshes } from "./cubeVisual";
import * as THREE from "three";
import gsap from "gsap";
import { ref, shallowRef } from "vue";

// Master group which contains all cubes
const masterGroup = shallowRef<THREE.Group | null>(null);

// Helper to detect rotation
export const isRotating = ref<boolean>(false);
export const activeTween = ref<gsap.core.Tween | null>(null);

// Variable to determine turn speed
export const turnSpeed = ref<number>(0.0);

// Use an enum to denote the different faces of a Rubik's Cube
export enum CubeNotation {
    R, L, U, D, F, B, M, S, E, // Regular moves
    r, l, u, d, f, b, // Wide moves
    x, y, z // Rotation moves
};

// Type to represent movement
export type CubeMove = {
    face: CubeNotation,
    prime: boolean,
    double: boolean
};

// Helper function to animate rotation
function animateRotateOnAxis(target, vars) {
    return new Promise<void>(resolve => {
        vars.onComplete = () => {
            activeTween.value = null;
            resolve();
        }; 
        
        activeTween.value = gsap.to(target, vars);
    })
}

function grabCubesFromFace(face: CubeNotation) {
    let cubes = meshes.value.map(mesh => mesh.cube)

    switch (face) {
        case CubeNotation.R:
            return cubes.filter(cube => cube.position.x > 0.5);
        case CubeNotation.L:
            return cubes.filter(cube => cube.position.x < -0.5);
        case CubeNotation.U:
            return cubes.filter(cube => cube.position.y > 0.5);
        case CubeNotation.D:
            return cubes.filter(cube => cube.position.y < -0.5);
        case CubeNotation.F:
            return cubes.filter(cube => cube.position.z > 0.5);
        case CubeNotation.B:
            return cubes.filter(cube => cube.position.z < -0.5);
        case CubeNotation.M:
            return cubes.filter(cube => cube.position.x === 0.0);
        case CubeNotation.S:
            return cubes.filter(cube => cube.position.z === 0.0);
        case CubeNotation.E:
            return cubes.filter(cube => cube.position.y === 0.0);
        case CubeNotation.r:
            return cubes.filter(cube => cube.position.x >= 0.0);
        case CubeNotation.l:
            return cubes.filter(cube => cube.position.x <= 0.0);
        case CubeNotation.u:
            return cubes.filter(cube => cube.position.y >= 0.0);
        case CubeNotation.d:
            return cubes.filter(cube => cube.position.y <= 0.0);
        case CubeNotation.f:
            return cubes.filter(cube => cube.position.z >= 0.0);
        case CubeNotation.b:
            return cubes.filter(cube => cube.position.z <= 0.0);
        case CubeNotation.x: case CubeNotation.y: case CubeNotation.z:
            return cubes
    }
}

export function useCubeLogic() {

    // Gets the compliment of the given move. Ex. R -> R'
    function getComplimentMove(move: CubeMove) { return { face: move.face, prime: !move.prime, double: move.double } }

    // Helper function to get correct cubeNotation
    function letterToCubeNotation(letter: string, wide_move: boolean = false) {
        switch (letter) {
            case "r": case "R":
                if (wide_move) return CubeNotation.r;
                return CubeNotation.R;
            case "l": case "L":
                if (wide_move) return CubeNotation.l;
                return CubeNotation.L;
            case "u": case "U":
                if (wide_move) return CubeNotation.u;
                return CubeNotation.U;
            case "d": case "D":
                if (wide_move) return CubeNotation.d;
                return CubeNotation.D;
            case "f": case "F":
                if (wide_move) return CubeNotation.f;
                return CubeNotation.F;
            case "b": case "B":
                if (wide_move) return CubeNotation.b;
                return CubeNotation.B;
            case "m": case "M":
                return CubeNotation.M;
            case "s": case "S":
                return CubeNotation.S;
            case "e": case "E":
                return CubeNotation.E;
            case "x": case "X":
                return CubeNotation.x;
            case "y": case "Y":
                return CubeNotation.y;
            case "z": case "Z":
                return CubeNotation.z;
        }
    }

    // Rotate a face based on the enum
    // Prime denotes if is counter clockwise (e.g. R', L', U', D', F', B')
    async function rotateFace(move: CubeMove, rotationTime: number = 0.0) {
        
        // Make sure there aren't any missing values
        if (!masterGroup.value) {
            console.warn("Scene or master group not ready");
            return;
        }

        const cubes = grabCubesFromFace(move.face);
        const cubesToRotate = cubes.map(cube => cube.object);
        let angle = move.prime ? Math.PI / 2 : -Math.PI / 2;

        // If double move, double angle
        if (move.double) angle *= 2;

        // Check if any cubes are null
        if (cubesToRotate.includes(null)) {
            console.log(cubesToRotate);
            console.warn("Some cubes are not yet initialized");
            return;
        }

        // Flip angle if face is L, D, or B to maintain correct direction
        if (move.face === CubeNotation.L || move.face === CubeNotation.D || move.face === CubeNotation.B || move.face === CubeNotation.M || move.face === CubeNotation.E || move.face === CubeNotation.l || move.face === CubeNotation.d || move.face === CubeNotation.b) angle *= -1;

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
            move.face === CubeNotation.R || move.face === CubeNotation.L || move.face === CubeNotation.M || move.face === CubeNotation.r || move.face === CubeNotation.l || move.face === CubeNotation.x ? 1 : 0,
            move.face === CubeNotation.U || move.face === CubeNotation.D || move.face === CubeNotation.E || move.face === CubeNotation.u || move.face === CubeNotation.d || move.face === CubeNotation.y ? 1 : 0,
            move.face === CubeNotation.F || move.face === CubeNotation.B || move.face === CubeNotation.S || move.face === CubeNotation.f || move.face === CubeNotation.b || move.face === CubeNotation.z ? 1 : 0
        );

        // Animate rotation if there is
        if (rotationTime > 0.0) {
            await animateRotateOnAxis({ angle: angle }, {
                angle: 0,
                duration: rotationTime,
                ease: "power1.inOut",
                onUpdate: function () {
                    const delta = angle - this.targets()[0].angle;
                    pivot.rotateOnAxis(axis, delta);
                    angle = this.targets()[0].angle;
                }
            });
        } else {
            pivot.rotateOnAxis(axis, angle);
        }

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

    return { masterGroup, getComplimentMove, rotateFace, letterToCubeNotation };
}
