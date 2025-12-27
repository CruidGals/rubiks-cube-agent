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
            if (move.double) mapping = [7, 1, 2, 4, 3, 5, 6, 0];
            else if (move.prime) mapping = [3, 1, 2, 7, 0, 5, 6, 4];
            else mapping = [4, 1, 2, 0, 7, 5, 6, 3];
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
            else if (move.prime) mapping = [0, 1, 2, 3, 7, 4, 5, 6];
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
            else if (move.prime) mapping = [3, 2, 6, 7, 0, 1, 5, 4];
            else mapping = [4, 5, 1, 0, 7, 6, 2, 3];
            break;
        case CubeNotation.y:
            if (move.double) mapping = [2, 3, 0, 1, 6, 7, 4, 5];
            else if (move.prime) mapping = [1, 2, 3, 0, 5, 6, 7, 4];
            else mapping = [3, 0, 1, 2, 7, 4, 5, 6];
            break;
        case CubeNotation.z:
            if (move.double) mapping = [5, 4, 7, 6, 1, 0, 3, 2];
            else if (move.prime) mapping = [4, 0, 3, 7, 5, 1, 2, 6];
            else mapping = [1, 5, 6, 2, 0, 4, 7, 3];
            break;
        default: return;
    }
    
    state.cp = permute(state.cp, mapping);
    state.co = permute(state.co, mapping);
}

function orientCorners(state: CubeState, move: CubeMove) {
    let mapping = [0, 0, 0, 0, 0, 0, 0, 0];

    // Double moves won't affect orientation
    if (move.double) return;

    switch(move.face) {
        case CubeNotation.R: case CubeNotation.r:
            mapping = [2, 0, 0, 1, 1, 0, 0, 2]; // Reg and prime move
            break;
        case CubeNotation.L: case CubeNotation.l:
            mapping = [0, 1, 2, 0, 0, 2, 1, 0];
            break;
        case CubeNotation.F: case CubeNotation.f:
            mapping = [1, 2, 0, 0, 2, 1, 0, 0];
            break;
        case CubeNotation.B: case CubeNotation.b:
            mapping = [0, 0, 1, 2, 0, 0, 2, 1];
            break;
        case CubeNotation.x:
            mapping = [2, 1, 2, 1, 1, 2, 1, 2];
            break;
        case CubeNotation.z:
            mapping = [1, 2, 1, 2, 2, 1, 2, 1];
            break;
        default: return;
    }

    // Orient corners modulo 3
    state.co = orient(state.co, mapping, 3);
}

function permuteEdges(state: CubeState, move: CubeMove) {
    let mapping = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    switch(move.face) {
        case CubeNotation.R: case CubeNotation.r:
            if (move.double) mapping = [4, 1, 2, 3, 0, 5, 6, 7, 11, 9, 10, 8];
            else if (move.prime) mapping = [11, 1, 2, 3, 8, 5, 6, 7, 0, 9, 10, 4];
            else mapping = [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0];
            break;
        case CubeNotation.L: case CubeNotation.l:
            if (move.double) mapping = [0, 1, 6, 3, 4, 5, 2, 7, 8, 10, 9, 11];
            else if (move.prime) mapping = [0, 1, 9, 3, 4, 5, 10, 7, 8, 6, 2, 11];
            else mapping = [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11];
            break;
        case CubeNotation.U: case CubeNotation.u:
            if (move.double) mapping = [2, 3, 0, 1, 4, 5, 6, 7, 8, 9, 10, 11];
            else if (move.prime) mapping = [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11];
            else mapping = [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];
            break;
        case CubeNotation.D: case CubeNotation.d:
            if (move.double) mapping = [0, 1, 2, 3, 6, 7, 4, 5, 8, 9, 10, 11];
            else if (move.prime) mapping = [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11];
            else mapping = [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11];
            break;
        case CubeNotation.F: case CubeNotation.f:
            if (move.double) mapping = [0, 5, 2, 3, 4, 1, 6, 7, 9, 8, 10, 11];
            else if (move.prime) mapping = [0, 8, 2, 3, 4, 9, 6, 7, 5, 1, 10, 11];
            else mapping = [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11];
            break;
        case CubeNotation.B: case CubeNotation.b:
            if (move.double) mapping = [0, 1, 2, 7, 4, 5, 6, 3, 8, 9, 11, 10];
            else if (move.prime) mapping = [0, 1, 2, 10, 4, 5, 6, 11, 8, 9, 7, 3];
            else mapping = [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7];
            break;
        case CubeNotation.M:
            if (move.double) mapping = [0, 7, 2, 5, 4, 3, 6, 1, 8, 9, 10, 11];
            else if (move.prime) mapping = [0, 5, 2, 1, 4, 7, 6, 3, 8, 9, 10, 11];
            else mapping = [0, 3, 2, 7, 4, 1, 6, 5, 8, 9, 10, 11];
            break;
        case CubeNotation.E:
            if (move.double) mapping = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 8, 9];
            else if (move.prime) mapping = [0, 1, 2, 3, 4, 5, 6, 7, 11, 8, 9, 10];
            else mapping = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8];
            break;
        case CubeNotation.S:
            if (move.double) mapping = [6, 1, 4, 3, 2, 5, 0, 7, 8, 9, 10, 11];
            else if (move.prime) mapping = [4, 1, 0, 3, 6, 5, 2, 7, 8, 9, 10, 11];
            else mapping = [2, 1, 6, 3, 0, 5, 4, 7, 8, 9, 10, 11];
            break;
        case CubeNotation.x:
            if (move.double) mapping = [4, 7, 6, 5, 0, 3, 2, 1, 11, 10, 9, 8];
            else if (move.prime) mapping = [11, 3, 10, 7, 8, 1, 9, 5, 0, 2, 6, 4];
            else mapping = [8, 5, 9, 1, 11, 7, 10, 3, 4, 6, 2, 0];
            break;
        case CubeNotation.y:
            if (move.double) mapping = [2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9];
            else if (move.prime) mapping = [1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8];
            else mapping = [3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10];
            break;
        case CubeNotation.z:
            if (move.double) mapping = [6, 5, 4, 7, 2, 1, 0, 3, 9, 8, 11, 10];
            else if (move.prime) mapping = [4, 8, 0, 11, 6, 9, 2, 10, 5, 1, 3, 7];
            else mapping = [2, 9, 6, 10, 0, 8, 4, 11, 1, 5, 7, 3];
            break;
    }

    state.ep = permute(state.ep, mapping);
    state.eo = permute(state.eo, mapping);
}

function orientEdges(state: CubeState, move: CubeMove) {
    let mapping = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Double moves won't affect orientation
    if (move.double) return;

    switch(move.face) {
        case CubeNotation.F: case CubeNotation.f:
            mapping = [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0];
            break;
        case CubeNotation.B: case CubeNotation.b:
            mapping = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1];
            break;
        case CubeNotation.S:
            mapping = [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0];
            break;
        case CubeNotation.z:
            mapping = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            break;
        default: return;
    }

    // Orient edges modulo 2
    state.eo = orient(state.eo, mapping, 2);
}

export async function updateCubeState(move: CubeMove) {
    console.log(move.prime);
    // For each valid move, perform permutation and orientation mappings
    permuteCorners(cubeState.value, move);
    orientCorners(cubeState.value, move);
    permuteEdges(cubeState.value, move);
    orientEdges(cubeState.value, move);
}