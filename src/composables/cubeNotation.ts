import { CubeMove, CubeNotation } from "./cubeLogic";
import { ref } from "vue";
import { orient, permute } from "./util";

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
    let mapping = [0, 1, 2, 3, 4, 5, 6, 7]

    switch(move.face) {
        case CubeNotation.R: case CubeNotation.r:
            if (move.double) mapping = [2, 3, 0, 1, 4, 5, 6, 7];
            else if (move.prime) mapping = [1, 2, 3, 0, 4, 5, 6, 7];
            else mapping = [3, 0, 1, 2, 4, 5, 6, 7];
            break;
        case CubeNotation.L: case CubeNotation.l:
            if (move.double) mapping = [0, 6, 5, 3, 4, 2, 1, 7];
            else if (move.prime) mapping = [0, 5, 1, 3, 4, 6, 2, 7];
            else mapping = [0, 2, 6, 3, 4, 1, 5, 7];
            break;
        case CubeNotation.U: case CubeNotation.u:
            if (move.double) mapping = [2, 3, 0, 1, 4, 5, 6, 7];
            else if (move.prime) mapping = [1, 2, 3, 0, 4, 5, 6, 7];
            else mapping = [3, 0, 1, 2, 4, 5, 6, 7];
            break;
        case CubeNotation.D: case CubeNotation.d:
            if (move.double) mapping = [0, 1, 2, 3, 6, 7, 4, 5];
            else if (move.prime) mapping = [0, 1, 2, 3, 5, 6, 7, 4];
            else mapping = [0, 1, 2, 3, 5, 6, 7, 4];
            break;
        case CubeNotation.F: case CubeNotation.f:
            if (move.double) mapping = [5, 4, 2, 3, 1, 0, 6, 7];
            else if (move.prime) mapping = [4, 0, 2, 3, 5, 1, 6, 7];
            else mapping = [1, 5, 2, 3, 0, 4, 6, 7];
            break;
        case CubeNotation.B: case CubeNotation.b:
            if (move.double) mapping = [0, 1, 7, 6, 4, 5, 3, 2];
            else if (move.prime) mapping = [0, 1, 6, 2, 4, 5, 7, 3];
            else mapping = [0, 1, 3, 7, 4, 5, 2, 6];
            break;
        case CubeNotation.x:
            if (move.double) mapping = [7, 6, 5, 4, 3, 2, 1, 0];
            else if (move.prime) mapping = [4, 5, 1, 0, 7, 6, 2, 3];
            else mapping = [3, 2, 6, 7, 0, 1, 5, 4];
            break;
        case CubeNotation.y:
            if (move.double) mapping = [2, 3, 0, 1, 6, 7, 4, 5];
            else if (move.prime) mapping = [1, 2, 3, 0, 5, 6, 7, 4];
            else mapping = [3, 0, 1, 2, 4, 5, 6, 7];
            break;
        case CubeNotation.z:
            if (move.double) mapping = [5, 4, 7, 6, 1, 0, 3, 2];
            else if (move.prime) mapping = [3, 0, 4, 7, 5, 1, 2, 6];
            else mapping = [1, 5, 6, 2, 0, 4, 7, 3];
            break;
        default: return;
    }

    state.cp = permute(state.cp, mapping);
    state.co = permute(state.co, mapping);
}

function orientCorners(state: CubeState, move: CubeMove) {
    let mapping = [0, 0, 0, 0, 0, 0, 0, 0];

    switch(move.face) {
        case CubeNotation.R: case CubeNotation.r:
            if (move.prime) [1, 0, 0, 2, 2, 0, 0, 1];        // Prime move
            else if (!move.double) [2, 0, 0, 1, 1, 0, 0, 2]; // Reg move
            break;
        case CubeNotation.L: case CubeNotation.l:
            if (move.prime) [0, 2, 1, 0, 0, 1, 2, 0];
            else if (!move.double) [0, 1, 2, 0, 0, 2, 1, 0];
            break;
        case CubeNotation.F: case CubeNotation.f:
            if (move.prime) [2, 1, 0, 0, 1, 2, 0, 0];
            else if (!move.double) [1, 2, 0, 0, 2, 1, 0, 0];
            break;
        case CubeNotation.B: case CubeNotation.b:
            if (move.prime) [0, 0, 2, 1, 0, 0, 1, 2];
            else if (!move.double) [0, 0, 1, 2, 0, 0, 2, 1];
            break;
        case CubeNotation.x: case CubeNotation.z:
            if (move.prime) [2, 1, 2, 1, 1, 2, 1, 2];
            else if (!move.double) [1, 2, 1, 2, 2, 1, 2, 1];
            break;
        default: return;
    }

    // Orient corners modulo 3
    state.co = orient(state.co, mapping, 3);
}

function updateCubeState(move: CubeMove) {
    // For each valid move, perform a permutation mapping
    switch(move.face) {
        case CubeNotation.R:

    }
}