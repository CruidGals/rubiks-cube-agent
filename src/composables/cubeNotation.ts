import { CubeMove, CubeNotation } from "./cubeLogic";
import { ref } from "vue";
import { orient, permute } from "./util";

enum Center {
    WHITE = 0,
    GREEN = 1,
    ORANGE = 2,
    BLUE = 3,
    RED = 4,
    YELLOW = 5,
}

// Based on notation.md
type CubeState = {
    centers: number[], // 0-5, 0 is white, 1 is green, 2 is orange, 3 is blue, 4 is red, 5 is yellow
    cp: number[],
    co: number[],
    ep: number[],
    eo: number[],
}

// Initial state of the rubiks cube
const cubeInitialState: CubeState = {
    centers: [Center.WHITE, Center.GREEN, Center.ORANGE, Center.BLUE, Center.RED, Center.YELLOW], // Centers convientely in order with white top green front
    cp: [0, 1, 2, 3, 4, 5, 6, 7],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

export const cubeState = ref<CubeState>(cubeInitialState);

// We want to get the move that would be played if white top green front
// Create fixed arrays representing the colors in relation to white top green front

const fixedFaceMap = {
    [Center.WHITE]: CubeNotation.U,
    [Center.GREEN]: CubeNotation.F,
    [Center.ORANGE]: CubeNotation.L,
    [Center.BLUE]: CubeNotation.B,
    [Center.RED]: CubeNotation.R,
    [Center.YELLOW]: CubeNotation.D,
}

const fixedFaceMapWide = {
    [Center.WHITE]: CubeNotation.u,
    [Center.GREEN]: CubeNotation.f,
    [Center.ORANGE]: CubeNotation.l,
    [Center.BLUE]: CubeNotation.b,
    [Center.RED]: CubeNotation.r,
    [Center.YELLOW]: CubeNotation.d,
}

// Based on top color and front color, determine the right neighbor color
const rightNeighbor = {
    [Center.WHITE]: { [Center.GREEN]: Center.RED, [Center.ORANGE]: Center.GREEN, [Center.BLUE]: Center.ORANGE, [Center.RED]: Center.BLUE },
    [Center.GREEN]: { [Center.ORANGE]: Center.YELLOW, [Center.YELLOW]: Center.RED, [Center.RED]: Center.WHITE, [Center.WHITE]: Center.ORANGE },
    [Center.RED]: { [Center.YELLOW]: Center.BLUE, [Center.BLUE]: Center.WHITE, [Center.WHITE]: Center.GREEN, [Center.GREEN]: Center.YELLOW },
    [Center.BLUE]: { [Center.YELLOW]: Center.ORANGE, [Center.ORANGE]: Center.WHITE, [Center.WHITE]: Center.RED, [Center.RED]: Center.YELLOW },
    [Center.ORANGE]: { [Center.YELLOW]: Center.GREEN, [Center.GREEN]: Center.WHITE, [Center.WHITE]: Center.BLUE, [Center.BLUE]: Center.YELLOW },
    [Center.YELLOW]: { [Center.BLUE]: Center.RED, [Center.RED]: Center.GREEN, [Center.GREEN]: Center.ORANGE, [Center.ORANGE]: Center.BLUE }
}

// Helper function to get the opposite center 
function getOppositeCenter(center: Center) {
    switch(center) {
        case Center.WHITE: return Center.YELLOW;
        case Center.GREEN: return Center.BLUE;
        case Center.ORANGE: return Center.RED;
        case Center.BLUE: return Center.GREEN;
        case Center.RED: return Center.BLUE;
        case Center.YELLOW: return Center.WHITE;
    }
}

// Helper to get the fixed slice face
function getFixedSliceMove(face: CubeNotation, topColor: Center, frontColor: Center): { face: CubeNotation, prime: boolean } {
    // Convert wide moves into slice moves if exists
    if (face === CubeNotation.r || face === CubeNotation.l) face = CubeNotation.M;
    else if (face === CubeNotation.u || face === CubeNotation.d) face = CubeNotation.E;
    else if (face === CubeNotation.f || face === CubeNotation.b) face = CubeNotation.S;
    
    // Validate that move is a slice move
    if (face !== CubeNotation.M && face !== CubeNotation.S && face !== CubeNotation.E) return { face: face, prime: false };

    let rightColor = rightNeighbor[topColor][frontColor];

    if (face === CubeNotation.M) {
        if (rightColor === Center.RED) return { face: face, prime: false };
        else if (rightColor === Center.ORANGE) return { face: face, prime: true };
        else if (rightColor === Center.GREEN) return { face: CubeNotation.S, prime: false };
        else if (rightColor === Center.BLUE) return { face: CubeNotation.S, prime: true };
        else if (rightColor === Center.YELLOW) return { face: CubeNotation.E, prime: false };
        else if (rightColor === Center.WHITE) return { face: CubeNotation.E, prime: true };
    }

    if (face === CubeNotation.E) {
        if (topColor === Center.WHITE) return { face: face, prime: false };
        else if (topColor === Center.YELLOW) return { face: face, prime: true };
        else if (topColor === Center.GREEN) return { face: CubeNotation.S, prime: true };
        else if (topColor === Center.BLUE) return { face: CubeNotation.S, prime: false };
        else if (topColor === Center.ORANGE) return { face: CubeNotation.M, prime: true };
        else if (topColor === Center.RED) return { face: CubeNotation.M, prime: false };
    }

    if (face === CubeNotation.S) {
        if (frontColor === Center.GREEN) return { face: face, prime: false };
        else if (frontColor === Center.BLUE) return { face: face, prime: true };
        else if (frontColor === Center.ORANGE) return { face: CubeNotation.M, prime: false };
        else if (frontColor === Center.RED) return { face: CubeNotation.M, prime: true };
        else if (frontColor === Center.YELLOW) return { face: CubeNotation.E, prime: false };
        else if (frontColor === Center.WHITE) return { face: CubeNotation.E, prime: true };
    }

    // Default return
    return { face: face, prime: false };
}

// Find the move that would be played if white top green front
function getFixedMove(move: CubeMove, topColor: Center, frontColor: Center) {
    // One thing to note is that, whether or not a move is primed will always stay the same
    // We just need to determine the correct fixed move

    // Cube rotation moves cannot be fixed
    if (move.face === CubeNotation.x || move.face === CubeNotation.y || move.face === CubeNotation.z) return move;

    switch(move.face) {
        case CubeNotation.R: return { face: fixedFaceMap[rightNeighbor[topColor][frontColor]], prime: move.prime, double: move.double }; break;
        case CubeNotation.r: return { face: fixedFaceMapWide[rightNeighbor[topColor][frontColor]], prime: move.prime, double: move.double }; break;
        case CubeNotation.L: return { face: fixedFaceMap[rightNeighbor[frontColor][topColor]], prime: move.prime, double: move.double }; break;
        case CubeNotation.l: return { face: fixedFaceMapWide[rightNeighbor[frontColor][topColor]], prime: move.prime, double: move.double }; break;
        case CubeNotation.U: return { face: fixedFaceMap[topColor], prime: move.prime, double: move.double }; break;
        case CubeNotation.u: return { face: fixedFaceMapWide[topColor], prime: move.prime, double: move.double }; break;
        case CubeNotation.D: return { face: fixedFaceMap[getOppositeCenter(topColor)], prime: move.prime, double: move.double }; break;
        case CubeNotation.d: return { face: fixedFaceMapWide[getOppositeCenter(topColor)], prime: move.prime, double: move.double }; break;
        case CubeNotation.F: return { face: fixedFaceMap[frontColor], prime: move.prime, double: move.double }; break;
        case CubeNotation.f: return { face: fixedFaceMapWide[frontColor], prime: move.prime, double: move.double }; break;
        case CubeNotation.B: return { face: fixedFaceMap[getOppositeCenter(frontColor)], prime: move.prime, double: move.double }; break;
        case CubeNotation.b: return { face: fixedFaceMapWide[getOppositeCenter(frontColor)], prime: move.prime, double: move.double }; break;
        default: break;
    }

    // At this point, we know the move is a slice move
    const { face: sliceFace, prime: slicePrime } = getFixedSliceMove(move.face, topColor, frontColor);
    return { face: sliceFace, prime: slicePrime ? !move.prime : move.prime, double: move.double };
}

function permuteCorners(state: CubeState, move: CubeMove) {
    let mapping = [0, 1, 2, 3, 4, 5, 6, 7]

    // Read notation.md for an explanation on the mappings
    switch(move.face) {
        case CubeNotation.R: case CubeNotation.l:
            if (move.double) mapping = [7, 1, 2, 4, 3, 5, 6, 0];
            else if (move.prime) mapping = [4, 1, 2, 0, 7, 5, 6, 3];
            else mapping = [3, 1, 2, 7, 0, 5, 6, 4];
            break;
        case CubeNotation.L: case CubeNotation.r:
            if (move.double) mapping = [0, 6, 5, 3, 4, 2, 1, 7];
            else if (move.prime) mapping = [0, 2, 6, 3, 4, 1, 5, 7];
            else mapping = [0, 5, 1, 3, 4, 6, 2, 7];
            break;
        case CubeNotation.U: case CubeNotation.d:
            if (move.double) mapping = [2, 3, 0, 1, 4, 5, 6, 7];
            else if (move.prime) mapping = [3, 0, 1, 2, 4, 5, 6, 7];
            else mapping = [1, 2, 3, 0, 4, 5, 6, 7];
            break;
        case CubeNotation.D: case CubeNotation.u:
            if (move.double) mapping = [0, 1, 2, 3, 6, 7, 4, 5];
            else if (move.prime) mapping = [0, 1, 2, 3, 5, 6, 7, 4];
            else mapping = [0, 1, 2, 3, 7, 4, 5, 6];
            break;
        case CubeNotation.F: case CubeNotation.b:
            if (move.double) mapping = [5, 4, 2, 3, 1, 0, 6, 7];
            else if (move.prime) mapping = [1, 5, 2, 3, 0, 4, 6, 7];
            else mapping = [4, 0, 2, 3, 5, 1, 6, 7];
            break;
        case CubeNotation.B: case CubeNotation.f:
            if (move.double) mapping = [0, 1, 7, 6, 4, 5, 3, 2];
            else if (move.prime) mapping = [0, 1, 3, 7, 4, 5, 2, 6];
            else mapping = [0, 1, 6, 2, 4, 5, 7, 3];
            break;
        case CubeNotation.M: // Treat as a simultaneous R move and L move
            if (move.double) mapping = [7, 6, 5, 4, 3, 2, 1, 0];
            else if (move.prime) mapping = [4, 5, 1, 0, 7, 6, 2, 3];
            else mapping = [3, 2, 6, 7, 0, 1, 5, 4];
            break;
        case CubeNotation.E: // Treat as a simultaneous U move and D move
            if (move.double) mapping = [2, 3, 0, 1, 6, 7, 4, 5];
            else if (move.prime) mapping = [3, 0, 1, 2, 7, 4, 5, 6];
            else mapping = [1, 2, 3, 0, 5, 6, 7, 4];
            break;
        case CubeNotation.S: // Treat as a simultaneous F move and B move
            if (move.double) mapping = [5, 4, 7, 6, 1, 0, 3, 2];
            else if (move.prime) mapping = [1, 5, 6, 2, 0, 4, 7, 3];
            else mapping = [4, 0, 3, 7, 5, 1, 2, 6];
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
        case CubeNotation.R: case CubeNotation.l:
            mapping = [2, 0, 0, 1, 1, 0, 0, 2]; // Reg and prime move
            break;
        case CubeNotation.L: case CubeNotation.r:
            mapping = [0, 1, 2, 0, 0, 2, 1, 0];
            break;
        case CubeNotation.F: case CubeNotation.b:
            mapping = [1, 2, 0, 0, 2, 1, 0, 0];
            break;
        case CubeNotation.B: case CubeNotation.f:
            mapping = [0, 0, 1, 2, 0, 0, 2, 1];
            break;
        case CubeNotation.M:
            mapping = [2, 1, 2, 1, 1, 2, 1, 2];
            break;
        case CubeNotation.S:
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
        case CubeNotation.R: case CubeNotation.l:
            if (move.double) mapping = [4, 1, 2, 3, 0, 5, 6, 7, 11, 9, 10, 8];
            else if (move.prime) mapping = [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0];
            else mapping = [11, 1, 2, 3, 8, 5, 6, 7, 0, 9, 10, 4];
            break;
        case CubeNotation.L: case CubeNotation.r:
            if (move.double) mapping = [0, 1, 6, 3, 4, 5, 2, 7, 8, 10, 9, 11];
            else if (move.prime) mapping = [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11];
            else mapping = [0, 1, 9, 3, 4, 5, 10, 7, 8, 6, 2, 11];
            break;
        case CubeNotation.U: case CubeNotation.d:
            if (move.double) mapping = [2, 3, 0, 1, 4, 5, 6, 7, 8, 9, 10, 11];
            else if (move.prime) mapping = [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];
            else mapping = [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11];
            break;
        case CubeNotation.D: case CubeNotation.u:
            if (move.double) mapping = [0, 1, 2, 3, 6, 7, 4, 5, 8, 9, 10, 11];
            else if (move.prime) mapping = [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11];
            else mapping = [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11];
            break;
        case CubeNotation.F: case CubeNotation.b:
            if (move.double) mapping = [0, 5, 2, 3, 4, 1, 6, 7, 9, 8, 10, 11];
            else if (move.prime) mapping = [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11];
            else mapping = [0, 8, 2, 3, 4, 9, 6, 7, 5, 1, 10, 11];
            break;
        case CubeNotation.B: case CubeNotation.f:
            if (move.double) mapping = [0, 1, 2, 7, 4, 5, 6, 3, 8, 9, 11, 10];
            else if (move.prime) mapping = [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7];
            else mapping = [0, 1, 2, 10, 4, 5, 6, 11, 8, 9, 7, 3];
            break;
        case CubeNotation.M:
            if (move.double) mapping = [4, 1, 6, 3, 0, 5, 2, 7, 11, 10, 9, 8];
            else if (move.prime) mapping = [8, 1, 9, 3, 11, 5, 10, 7, 4, 6, 2, 0];
            else mapping = [11, 1, 10, 3, 8, 5, 9, 7, 0, 2, 6, 4];
            break;
        case CubeNotation.E:
            if (move.double) mapping = [2, 3, 0, 1, 6, 7, 4, 5, 8, 9, 10, 11];
            else if (move.prime) mapping = [3, 0, 1, 2, 7, 4, 5, 6, 8, 9, 10, 11];
            else mapping = [1, 2, 3, 0, 5, 6, 7, 4, 8, 9, 10, 11];
            break;
        case CubeNotation.S:
            if (move.double) mapping = [0, 5, 2, 7, 4, 1, 6, 3, 9, 8, 11, 10];
            else if (move.prime) mapping = [0, 9, 2, 10, 4, 8, 6, 11, 1, 5, 7, 3];
            else mapping = [0, 8, 2, 11, 4, 9, 6, 10, 5, 1, 3, 7];
            break;
        default: return;
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
            mapping = [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1];
            break;
        default: return;
    }

    // Orient edges modulo 2
    state.eo = orient(state.eo, mapping, 2);
}

function updateCenters(state: CubeState, move: CubeMove) {
    let mapping = [0, 1, 2, 3, 4, 5];
    
    switch(move.face) {
        case CubeNotation.x:
            if (move.double) mapping = [5, 3, 2, 1, 4, 0];
            else if (move.prime) mapping = [1, 5, 2, 0, 4, 3];
            else mapping = [3, 0, 2, 5, 4, 1];
            break;
        case CubeNotation.y:
            if (move.double) mapping = [0, 3, 4, 1, 2, 5];
            else if (move.prime) mapping = [0, 4, 1, 2, 3, 5];
            else mapping = [0, 2, 3, 4, 1, 5];
            break;
        case CubeNotation.z:
            if (move.double) mapping = [5, 1, 4, 3, 2, 0];
            else if (move.prime) mapping = [2, 1, 5, 3, 0, 4];
            else mapping = [4, 1, 0, 3, 5, 2];
            break;
        default: return;
    }

    state.centers = permute(state.centers, mapping);
}

export async function updateCubeState(move: CubeMove) {
    // Update centers first if doing a slice move
    updateCenters(cubeState.value, move);

    const fixedMove = getFixedMove(move, cubeState.value.centers[0], cubeState.value.centers[1]);

    // For each valid move, perform permutation and orientation mappings
    permuteCorners(cubeState.value, fixedMove);
    orientCorners(cubeState.value, fixedMove);
    permuteEdges(cubeState.value, fixedMove);
    orientEdges(cubeState.value, fixedMove);
}