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

const f2lPairKeys = [
    "firstPairSolved", "secondPairSolved", "thirdPairSolved", "fourthPairSolved",
] as const satisfies readonly (keyof CheckF2LResult)[];

/* -------------------------- CFOP Pipeline -------------------------- */

const PIPELINE_STEPS = ["cross", "f2l", "oll", "pll"] as const;
type PipelineStep = typeof PIPELINE_STEPS[number];

const INVALID_THRESHOLD = 15;
const F2L_PAIR_COUNT = 4;

const stepInvalidCounts: Record<Exclude<PipelineStep, "f2l">, number> = {
    cross: 0,
    oll: 0,
    pll: 0,
};

const f2lPairInvalidCounts = Array<number>(F2L_PAIR_COUNT).fill(0);

function resetAllF2LPairs() {
    for (const key of f2lPairKeys) cfopSolvedStates.f2l[key] = false;
    f2lPairInvalidCounts.fill(0);
}

function resetF2LPair(pairIndex: number) {
    cfopSolvedStates.f2l[f2lPairKeys[pairIndex]] = false;
    f2lPairInvalidCounts[pairIndex] = 0;
    resetFromStep("oll");
}

function resetStepState(step: PipelineStep) {
    switch (step) {
        case "cross":
            cfopSolvedStates.cross.isSolved = false;
            cfopSolvedStates.cross.crossColor = null;
            stepInvalidCounts.cross = 0;
            break;
        case "f2l":
            resetAllF2LPairs();
            break;
        case "oll":
            cfopSolvedStates.oll.isSolved = false;
            stepInvalidCounts.oll = 0;
            break;
        case "pll":
            cfopSolvedStates.pll.isSolved = false;
            stepInvalidCounts.pll = 0;
            break;
    }
}

function resetFromStep(step: PipelineStep) {
    const start = PIPELINE_STEPS.indexOf(step);
    for (let i = start; i < PIPELINE_STEPS.length; i++) {
        resetStepState(PIPELINE_STEPS[i]);
    }
}

// Returns false when the step hit its invalid threshold and reset itself + later steps.
function validateStep(step: Exclude<PipelineStep, "f2l">, isValid: boolean): boolean {
    if (isValid) {
        stepInvalidCounts[step] = 0;
        return true;
    }

    stepInvalidCounts[step]++;
    if (stepInvalidCounts[step] >= INVALID_THRESHOLD) {
        resetFromStep(step);
        return false;
    }
    return true;
}

// Returns false when this pair hit its invalid threshold (pair unsolved, OLL/PLL reset).
function validateF2LPair(pairIndex: number, isValid: boolean): boolean {
    if (isValid) {
        f2lPairInvalidCounts[pairIndex] = 0;
        return true;
    }

    f2lPairInvalidCounts[pairIndex]++;
    if (f2lPairInvalidCounts[pairIndex] >= INVALID_THRESHOLD) {
        resetF2LPair(pairIndex);
        return false;
    }
    return true;
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

function checkCrossSolved(state: CubeState): boolean {
    if (!cfopSolvedStates.cross.isSolved) {
        for (const color of [Color.WHITE, Color.GREEN, Color.ORANGE, Color.BLUE, Color.RED, Color.YELLOW]) {
            if (crossCheckers[color](state.ep, state.eo)) {
                cfopSolvedStates.cross.isSolved = true;
                cfopSolvedStates.cross.crossColor = color;
                stepInvalidCounts.cross = 0;
                return true;
            }
        }
        return false;
    }

    const crossColor = cfopSolvedStates.cross.crossColor!;
    return validateStep("cross", crossCheckers[crossColor](state.ep, state.eo));
}

/* -------------------------- Check F2L -------------------------- */

type F2LChecker = (state: CubeState) => boolean;

export type F2LPairSlots = {
    cornerIndex: number;
    edgeIndex: number;
};

// Slot indices per pair (piece i must sit at slot i; all co/eo must be 0)
const f2lPairSlots: Record<Color, F2LPairSlots[]> = {
    [Color.WHITE]: [
        { cornerIndex: 0, edgeIndex: 8  }, // pair 1: between crossEdgeIndices[0] & [1]
        { cornerIndex: 1, edgeIndex: 9  }, // pair 2: between crossEdgeIndices[1] & [2]
        { cornerIndex: 2, edgeIndex: 10 }, // pair 3: between crossEdgeIndices[2] & [3]
        { cornerIndex: 3, edgeIndex: 11 }, // pair 4: between crossEdgeIndices[3] & [0]
    ],
    [Color.GREEN]: [
        { cornerIndex: 0, edgeIndex: 0 },
        { cornerIndex: 4, edgeIndex: 4 },
        { cornerIndex: 5, edgeIndex: 6 },
        { cornerIndex: 1, edgeIndex: 2 },
    ],
    [Color.ORANGE]: [
        { cornerIndex: 1, edgeIndex: 1 },
        { cornerIndex: 5, edgeIndex: 5 },
        { cornerIndex: 6, edgeIndex: 7 },
        { cornerIndex: 2, edgeIndex: 3 },
    ],
    [Color.BLUE]: [
        { cornerIndex: 2, edgeIndex: 2 },
        { cornerIndex: 6, edgeIndex: 6 },
        { cornerIndex: 7, edgeIndex: 4 },
        { cornerIndex: 3, edgeIndex: 0 },
    ],
    [Color.RED]: [
        { cornerIndex: 3, edgeIndex: 3 },
        { cornerIndex: 7, edgeIndex: 7 },
        { cornerIndex: 4, edgeIndex: 5 },
        { cornerIndex: 0, edgeIndex: 1 },
    ],
    [Color.YELLOW]: [
        { cornerIndex: 4, edgeIndex: 8  },
        { cornerIndex: 5, edgeIndex: 9  },
        { cornerIndex: 6, edgeIndex: 10 },
        { cornerIndex: 7, edgeIndex: 11 },
    ],
};

function createF2LPairChecker({ cornerIndex, edgeIndex }: F2LPairSlots): F2LChecker {
    return (state) =>
        state.cp[cornerIndex] === cornerIndex && state.co[cornerIndex] === 0 &&
        state.ep[edgeIndex] === edgeIndex && state.eo[edgeIndex] === 0;
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

export function isF2LPairSolvedForColor(color: Color, pairIndex: number, state: CubeState): boolean {
    return f2lPairCheckers[color][pairIndex](state);
}

export function isF2LSolved(): boolean {
    const f2l = cfopSolvedStates.f2l;
    return f2l.firstPairSolved && f2l.secondPairSolved && f2l.thirdPairSolved && f2l.fourthPairSolved;
}

function checkF2LPairs(state: CubeState): boolean {
    const crossColor = cfopSolvedStates.cross.crossColor;
    if (crossColor === null) return false;

    const checkers = f2lPairCheckers[crossColor];

    for (let pairIndex = 0; pairIndex < F2L_PAIR_COUNT; pairIndex++) {
        const key = f2lPairKeys[pairIndex];
        const isPairSolved = checkers[pairIndex](state);

        if (cfopSolvedStates.f2l[key]) {
            if (!validateF2LPair(pairIndex, isPairSolved)) return false;
        } else if (isPairSolved) {
            cfopSolvedStates.f2l[key] = true;
            f2lPairInvalidCounts[pairIndex] = 0;
        }
    }

    return true;
}

/* -------------------------- Check OLL / PLL -------------------------- */

function checkOLLSolved(state: CubeState): boolean {
    if (!cfopSolvedStates.oll.isSolved) {
        // TODO: detect OLL solved
        return true;
    }

    // TODO: replace with OLL checker
    return validateStep("oll", true);
}

function checkPLLSolved(state: CubeState): boolean {
    if (!cfopSolvedStates.pll.isSolved) {
        // TODO: detect PLL solved
        return true;
    }

    // TODO: replace with PLL checker
    return validateStep("pll", true);
}

/* -------------------------- Check Everything -------------------------- */

export function resetCfopSolvedStates() {
    resetFromStep("cross");
}

export function checkCfopState(state: CubeState) {
    if (!checkCrossSolved(state)) return;
    if (!checkF2LPairs(state)) return;
    if (!checkOLLSolved(state)) return;
    checkPLLSolved(state);
}