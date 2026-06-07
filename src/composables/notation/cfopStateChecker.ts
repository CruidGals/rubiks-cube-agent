import { CubeState } from "./cubeNotation";
import { Color } from "./cubeNotation";

// Global cfop state checker
export type CfopSolvedStates = {
    cross: CheckCrossResult;
    f2l: CheckF2LResult;
    oll: CheckOLLResult;
    pll: CheckPLLResult;
}

export const cfopSolvedStates: CfopSolvedStates = {
    cross: {
        isSolved: false,
        crossColor: null,
    },
    f2l: {
        firstPairSolved: false,
        secondPairSolved: false,
        thirdPairSolved: false,
        fourthPairSolved: false,
    },
    oll: {
        isSolved: false,
    },
    pll: {
        isSolved: false,
    },
}

/* --------------------- Return Types for functions ------------------- */

type CheckCrossResult = {
    isSolved: boolean;
    crossColor: Color | null;
}

// F2L is checked individually, between cross edge pairs
type CheckF2LResult = {
    firstPairSolved:  boolean; // between crossEdgeIndices[0] & crossEdgeIndices[1]
    secondPairSolved: boolean; // between crossEdgeIndices[1] & crossEdgeIndices[2]
    thirdPairSolved:  boolean; // between crossEdgeIndices[2] & crossEdgeIndices[3]
    fourthPairSolved: boolean; // between crossEdgeIndices[3] & crossEdgeIndices[0]
}

type CheckOLLResult = {
    isSolved: boolean;
}

type CheckPLLResult = {
    isSolved: boolean;
}

/* -------------------------- Check Cross -------------------------- */

type CrossChecker = (ep: number[], eo: number[]) => boolean;

// Edge indices for each center-color cross (piece i must sit at slot i with eo 0)
const crossEdgeIndices: Record<Color, number[]> = {
    [Color.WHITE]: [0, 1, 2, 3],     // UR, UF, UL, UB
    [Color.GREEN]: [1, 8, 5, 9],     // UF, FR, DF, FL
    [Color.ORANGE]: [2, 9, 6, 10],   // UL, FL, DL, BL
    [Color.BLUE]: [3, 10, 7, 11],    // UB, BL, DB, BR
    [Color.RED]: [0, 8, 4, 11],      // UR, FR, DR, BR
    [Color.YELLOW]: [4, 5, 6, 7],    // DR, DF, DL, DB
};

function createCrossChecker(edgeIndices: number[]): CrossChecker {
    return (ep, eo) => edgeIndices.every(i => ep[i] === i && eo[i] === 0);
}

export const crossCheckers: Record<Color, CrossChecker> = {
    [Color.WHITE]: createCrossChecker(crossEdgeIndices[Color.WHITE]),
    [Color.GREEN]: createCrossChecker(crossEdgeIndices[Color.GREEN]),
    [Color.ORANGE]: createCrossChecker(crossEdgeIndices[Color.ORANGE]),
    [Color.BLUE]: createCrossChecker(crossEdgeIndices[Color.BLUE]),
    [Color.RED]: createCrossChecker(crossEdgeIndices[Color.RED]),
    [Color.YELLOW]: createCrossChecker(crossEdgeIndices[Color.YELLOW]),
};

export function isCrossSolvedForColor(color: Color, state: CubeState): boolean {
    return crossCheckers[color](state.ep, state.eo);
}

function checkCrossSolved(state: CubeState) {
    // Check if cross is already solved
    if (cfopSolvedStates.cross.isSolved) return true;

    for (const color of [Color.WHITE, Color.GREEN, Color.ORANGE, Color.BLUE, Color.RED, Color.YELLOW]) {
        if (crossCheckers[color](state.ep, state.eo)) {
            cfopSolvedStates.cross.isSolved = true;
            cfopSolvedStates.cross.crossColor = color;
            return true;
        }
    }

    return false;
}

/* -------------------------- Check F2L -------------------------- */

type F2LChecker = (state: CubeState) => boolean;

export type F2LPairSlots = {
    cornerIndices: number[];
    edgeIndices: number[];
};

// Slot indices per pair (piece i must sit at slot i; all co/eo must be 0)
const f2lPairSlots: Record<Color, F2LPairSlots[]> = {
    [Color.WHITE]: [
        { cornerIndices: [], edgeIndices: [] }, // pair 1: between crossEdgeIndices[0] & [1]
        { cornerIndices: [], edgeIndices: [] }, // pair 2: between crossEdgeIndices[1] & [2]
        { cornerIndices: [], edgeIndices: [] }, // pair 3: between crossEdgeIndices[2] & [3]
        { cornerIndices: [], edgeIndices: [] }, // pair 4: between crossEdgeIndices[3] & [0]
    ],
    [Color.GREEN]: [
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
    ],
    [Color.ORANGE]: [
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
    ],
    [Color.BLUE]: [
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
    ],
    [Color.RED]: [
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
    ],
    [Color.YELLOW]: [
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
        { cornerIndices: [], edgeIndices: [] },
    ],
};

function createF2LPairChecker({ cornerIndices, edgeIndices }: F2LPairSlots): F2LChecker {
    return (state) => {
        if (cornerIndices.length === 0 && edgeIndices.length === 0) return false;

        return cornerIndices.every(i => state.cp[i] === i && state.co[i] === 0) &&
               edgeIndices.every(i => state.ep[i] === i && state.eo[i] === 0);
    };
}

function createF2LCheckersForColor(pairs: F2LPairSlots[]): F2LChecker[] {
    return pairs.map(createF2LPairChecker);
}

export const f2lPairCheckers: Record<Color, F2LChecker[]> = {
    [Color.WHITE]: createF2LCheckersForColor(f2lPairSlots[Color.WHITE]),
    [Color.GREEN]: createF2LCheckersForColor(f2lPairSlots[Color.GREEN]),
    [Color.ORANGE]: createF2LCheckersForColor(f2lPairSlots[Color.ORANGE]),
    [Color.BLUE]: createF2LCheckersForColor(f2lPairSlots[Color.BLUE]),
    [Color.RED]: createF2LCheckersForColor(f2lPairSlots[Color.RED]),
    [Color.YELLOW]: createF2LCheckersForColor(f2lPairSlots[Color.YELLOW]),
};

const f2lPairKeys: (keyof CheckF2LResult)[] = [
    "firstPairSolved", "secondPairSolved", "thirdPairSolved", "fourthPairSolved",
];

export function isF2LPairSolvedForColor(color: Color, pairIndex: number, state: CubeState): boolean {
    return f2lPairCheckers[color][pairIndex](state);
}

export function isF2LSolved(): boolean {
    const f2l = cfopSolvedStates.f2l;
    return f2l.firstPairSolved && f2l.secondPairSolved && f2l.thirdPairSolved && f2l.fourthPairSolved;
}

function checkF2LSolved(state: CubeState) {
    const crossColor = cfopSolvedStates.cross.crossColor;
    if (crossColor === null) return;

    f2lPairKeys.forEach((key, pairIndex) => {
        if (!cfopSolvedStates.f2l[key] && f2lPairCheckers[crossColor][pairIndex](state)) {
            cfopSolvedStates.f2l[key] = true;
        }
    });
}

/* -------------------------- Check Everything -------------------------- */

export function resetCfopSolvedStates() {
    cfopSolvedStates.cross.isSolved = false;
    cfopSolvedStates.cross.crossColor = null;
    cfopSolvedStates.f2l.firstPairSolved = false;
    cfopSolvedStates.f2l.secondPairSolved = false;
    cfopSolvedStates.f2l.thirdPairSolved = false;
    cfopSolvedStates.f2l.fourthPairSolved = false;
    cfopSolvedStates.oll.isSolved = false;
    cfopSolvedStates.pll.isSolved = false;
}

// Used to count how many times the cross is invalid
// Once it reaches 15 moves (arbitrary number), cross
// is invalidated and cfop state is reset
let crossInvalidCount: number = 0;

export function checkCfopState(state: CubeState) {
    // Check the cross first
    if (!checkCrossSolved(state)) return;

    let crossColor = cfopSolvedStates.cross.crossColor;
    if (crossCheckers[crossColor](state.ep, state.eo)) crossInvalidCount = 0;
    else crossInvalidCount++;

    if (crossInvalidCount >= 15) {
        resetCfopSolvedStates();
        return;
    }

    checkF2LSolved(state);

    // Do the rest
}