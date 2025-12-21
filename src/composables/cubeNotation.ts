import { CubeMove, CubeNotation } from "./cubeLogic";
import { ref } from "vue";
import { permute } from "./util";

// Based on notation.md
type CubeState = {
    cp: number[],
    co: number[],
    ep: number[],
    eo: number[],
}

// Initial state of the rubiks cube
const cubeInitialState: CubeState = {
    cp: [0, 1, 2, 3, 4, 5, 6, 7],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

export const cubeState = ref<CubeState>(cubeInitialState);

function permuteCorners(state: CubeState, move: CubeMove) {
    switch(move.face) {
        case CubeNotation.R: case CubeNotation.r:
            if (move.prime) state.cp = permute(state.cp, [1, 2, 3, 0, 4, 5, 6, 7]);
            else if (move.double) state.cp = permute(state.cp, [2, 3, 0, 1, 4, 5, 6, 7]);
            else state.cp = permute(state.cp, [3, 0, 1, 2, 4, 5, 6, 7]);
            return;
        case CubeNotation.L: case CubeNotation.l:
            if (move.prime) state.cp = permute(state.cp, [0, 5, 1, 3, 4, 6, 2, 7]);
            else if (move.double) state.cp = permute(state.cp, [0, 6, 5, 3, 4, 2, 1, 7]);
            else state.cp = permute(state.cp, [0, 2, 6, 3, 4, 1, 5, 7]);
            return;
        case CubeNotation.U: case CubeNotation.u:
            if (move.prime) state.cp = permute(state.cp, [1, 2, 3, 0, 4, 5, 6, 7]);
            else if (move.double) state.cp = permute(state.cp, [2, 3, 0, 1, 4, 5, 6, 7]);
            else state.cp = permute(state.cp, [3, 0, 1, 2, 4, 5, 6, 7]);
            return;
        case CubeNotation.D: case CubeNotation.d:
            if (move.prime) state.cp = permute(state.cp, [0, 1, 2, 3, 5, 6, 7, 4]);
            else if (move.double) state.cp = permute(state.cp, [0, 1, 2, 3, 6, 7, 4, 5]);
            else state.cp = permute(state.cp, [0, 1, 2, 3, 5, 6, 7, 4]);
            return;
        case CubeNotation.F: case CubeNotation.f:
            if (move.prime) state.cp = permute(state.cp, [4, 0, 2, 3, 5, 1, 6, 7]);
            else if (move.double) state.cp = permute(state.cp, [5, 4, 2, 3, 1, 0, 6, 7]);
            else state.cp = permute(state.cp, [1, 5, 2, 3, 0, 4, 6, 7]);
            return;
        case CubeNotation.B: case CubeNotation.b:
            if (move.prime) state.cp = permute(state.cp, [0, 1, 6, 2, 4, 5, 7, 3]);
            else if (move.double) state.cp = permute(state.cp, [0, 1, 7, 6, 4, 5, 3, 2]);
            else state.cp = permute(state.cp, [0, 1, 3, 7, 4, 5, 2, 6]);
            return;
        case CubeNotation.x:
            if (move.prime) state.cp = permute(state.cp, [4, 5, 1, 0, 7, 6, 2, 3]);
            else if (move.double) state.cp = permute(state.cp, [7, 6, 5, 4, 3, 2, 1, 0]);
            else state.cp = permute(state.cp, [3, 2, 6, 7, 0, 1, 5, 4]);
            return;
        case CubeNotation.y:
            if (move.prime) state.cp = permute(state.cp, [1, 2, 3, 0, 5, 6, 7, 4]);
            else if (move.double) state.cp = permute(state.cp, [2, 3, 0, 1, 6, 7, 4, 5]);
            else state.cp = permute(state.cp, [3, 0, 1, 2, 4, 5, 6, 7]);
            return;
        case CubeNotation.z:
            if (move.prime) state.cp = permute(state.cp, [3, 0, 4, 7, 5, 1, 2, 6]);
            else if (move.double) state.cp = permute(state.cp, [5, 4, 7, 6, 1, 0, 3, 2]);
            else state.cp = permute(state.cp, [1, 5, 6, 2, 0, 4, 7, 3]);
            return;
        default: return;
    }
}

function updateCubeState(move: CubeMove) {
    // For each valid move, perform a permutation mapping
    switch(move.face) {
        case CubeNotation.R:

    }
}