import { cubes } from "./cubeVisual";
import * as THREE from "three";
import gsap from "gsap";
import { ref, shallowRef } from "vue";
import { isLowerCase } from "./util";

// Master group which contains all cubes
const masterGroup = shallowRef<THREE.Group | null>(null);

// Use an enum to denote the different faces of a Rubik's Cube
export enum CubeNotation {
    R, L, U, D, F, B, M, S, E, // Regular moves
    WR, WL, WU, WD, WF, WB, // Wide moves
    RX, RY, RZ // Rotation moves
};

// Type to represent movement
type CubeMove = {
    face: CubeNotation,
    prime: boolean,
    double: boolean
};

// Helper function to animate rotation
function animateRotateOnAxis(target, vars) {
    return new Promise(resolve => {
        vars.onComplete = resolve; 
        gsap.to(target, vars);
    })
}

// Helper function to get correct cubeNotation
function letterToCubeNotation(letter: string, wide_move: boolean = false) {
    switch (letter) {
        case "r": case "R":
            if (wide_move) return CubeNotation.WR;
            return CubeNotation.R;
        case "l": case "L":
            if (wide_move) return CubeNotation.WL;
            return CubeNotation.L;
        case "u": case "U":
            if (wide_move) return CubeNotation.WU;
            return CubeNotation.U;
        case "d": case "D":
            if (wide_move) return CubeNotation.WD;
            return CubeNotation.D;
        case "f": case "F":
            if (wide_move) return CubeNotation.WF;
            return CubeNotation.F;
        case "b": case "B":
            if (wide_move) return CubeNotation.WB;
            return CubeNotation.B;
        case "m": case "M":
            return CubeNotation.M;
        case "s": case "S":
            return CubeNotation.S;
        case "e": case "E":
            return CubeNotation.E;
        case "x": case "X":
            return CubeNotation.RX;
        case "y": case "Y":
            return CubeNotation.RY;
        case "z": case "Z":
            return CubeNotation.RZ;
    }
}

// Read a set of moves (in a string), and return a queue
function readMoves(moves: string) {
    // Strategy: skip all whitespace
    // character must be a move or number 2
    let lines: string[] = moves.split(/\r?\n|\r|\n/g);
    let cubeMoves: CubeMove[] = [];

    for (const line of lines) {
        for (let i = 0; i < line.length; i++ ) {
            let move = line[i];

            // If found a comment (double slash), just end the loop
            if (move === "/" && line[i+1] === "/") break;

            // Skip spaces, newline, and tabs
            if (" \t\n".includes(move)) continue;
            
            // Invalid character, skip and return nothing (not including 2 or ' because we parse that while parsing the move)
            if (!"rludfbxyzRLUDFBMSE".includes(move)) return null;

            // Parse move
            let cubeMove: CubeMove = {face: letterToCubeNotation(move, isLowerCase(move)), prime: false, double: false};

            // Check if there's a prime or 2 after
            if (i < (line.length - 1)) {
                if (line[i+1] === "'") { cubeMove.prime = true;  i++; }
                if (line[i+1] === "2") { cubeMove.double = true; i++; }
            }

            // Add it to list
            cubeMoves.push(cubeMove);
        }
    }

    return cubeMoves;
}

// Helper to detect rotation
export const isRotating = ref<boolean>(false);

// Detector if current playing an entered set of moves
const playingMoves = ref<boolean>(false);

// Variable to determine turn speed
export const turnSpeed = ref<number>(0.0);

export function useCubeLogic() {
    function grabCubesFromFace(face: CubeNotation) {
        switch (face) {
            case CubeNotation.R:
                return cubes.value.filter(cube => cube.position.x > 0.5);
            case CubeNotation.L:
                return cubes.value.filter(cube => cube.position.x < -0.5);
            case CubeNotation.U:
                return cubes.value.filter(cube => cube.position.y > 0.5);
            case CubeNotation.D:
                return cubes.value.filter(cube => cube.position.y < -0.5);
            case CubeNotation.F:
                return cubes.value.filter(cube => cube.position.z > 0.5);
            case CubeNotation.B:
                return cubes.value.filter(cube => cube.position.z < -0.5);
            case CubeNotation.M:
                return cubes.value.filter(cube => cube.position.x === 0.0);
            case CubeNotation.S:
                return cubes.value.filter(cube => cube.position.z === 0.0);
            case CubeNotation.E:
                return cubes.value.filter(cube => cube.position.y === 0.0);
            case CubeNotation.WR:
                return cubes.value.filter(cube => cube.position.x >= 0.0);
            case CubeNotation.WL:
                return cubes.value.filter(cube => cube.position.x <= 0.0);
            case CubeNotation.WU:
                return cubes.value.filter(cube => cube.position.y >= 0.0);
            case CubeNotation.WD:
                return cubes.value.filter(cube => cube.position.y <= 0.0);
            case CubeNotation.WF:
                return cubes.value.filter(cube => cube.position.z >= 0.0);
            case CubeNotation.WB:
                return cubes.value.filter(cube => cube.position.z <= 0.0);
            case CubeNotation.RX: case CubeNotation.RY: case CubeNotation.RZ:
                return cubes.value
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
        if (move.face === CubeNotation.L || move.face === CubeNotation.D || move.face === CubeNotation.B || move.face === CubeNotation.M || move.face === CubeNotation.WL || move.face === CubeNotation.WD || move.face === CubeNotation.WB) angle *= -1;

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
            move.face === CubeNotation.R || move.face === CubeNotation.L || move.face === CubeNotation.M || move.face === CubeNotation.WR || move.face === CubeNotation.WL || move.face === CubeNotation.RX ? 1 : 0,
            move.face === CubeNotation.U || move.face === CubeNotation.D || move.face === CubeNotation.E || move.face === CubeNotation.WU || move.face === CubeNotation.WD || move.face === CubeNotation.RY ? 1 : 0,
            move.face === CubeNotation.F || move.face === CubeNotation.B || move.face === CubeNotation.S || move.face === CubeNotation.WF || move.face === CubeNotation.WB || move.face === CubeNotation.RZ ? 1 : 0
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

    async function handleRotation(event: KeyboardEvent) {
        // Don't turn the cube if it's rotating or playing moves
        if (isRotating.value || playingMoves.value) return;

        // Make sure its a valid key
        if (!"rludfbmsexyzRLUDFBMSEXYZ".includes(event.key)) return;

        isRotating.value = true;
        let move = {face: letterToCubeNotation(event.key, event.ctrlKey), prime: event.shiftKey, double: false};
        await rotateFace(move, turnSpeed.value / 10);
        isRotating.value = false;
    }

    // Plays a set of moves given
    async function playMoves(moves: string) {
        // If already playing a set of moves, don't do it
        if (playingMoves.value) return;

        // Grab the moves
        let cubeMoves = readMoves(moves);

        // If invalid, don't continue
        if (cubeMoves == null) {
            console.error("Error: invalid move combination.");
            return;
        }

        // Begin playing the moves to the user
        playingMoves.value = true;
        for (const cubeMove of cubeMoves) {
            await rotateFace(cubeMove, turnSpeed.value / 10);
        }
        playingMoves.value = false;
    }

    return { masterGroup, rotateFace, handleRotation, playMoves, turnSpeed, isRotating };
}
