import { StaticReadUsage } from "three";
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
        isSolved: false,
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

type CheckF2LResult = {
    isSolved: boolean;
}

type CheckOLLResult = {
    isSolved: boolean;
}

type CheckPLLResult = {
    isSolved: boolean;
}

/* -------------------------- Check Cross -------------------------- */

function checkCrossSolved(state: CubeState) {
    // Check if cross is already solved
    if (cfopSolvedStates.cross.isSolved) return;
    
    // Check white cross first (UR, UF, UL, UB in right place)
    if ((state.ep[0] == 0 && state.ep[1] == 1 && state.ep[2] == 2 && state.ep[3] == 3) &&
        (state.eo[0] == 0 && state.eo[1] == 0 && state.eo[2] == 0 && state.eo[3] == 0)) {

        cfopSolvedStates.cross.isSolved = true;
        cfopSolvedStates.cross.crossColor = Color.WHITE;
        return;
    }

    // Check green cross (UF, FR, DF, FL in right place)
    if ((state.ep[1] == 1 && state.ep[8] == 8 && state.ep[5] == 5 && state.ep[9] == 9) &&
        (state.eo[1] == 0 && state.eo[8] == 0 && state.eo[5] == 0 && state.eo[9] == 0)) {

        cfopSolvedStates.cross.isSolved = true;
        cfopSolvedStates.cross.crossColor = Color.GREEN;
        return;
    }

    // Check orange cross (UL, FL, DL, BL in right place)
    if ((state.ep[2] == 2 && state.ep[9] == 9 && state.ep[6] == 6 && state.ep[10] == 10) &&
        (state.eo[2] == 0 && state.eo[9] == 0 && state.eo[6] == 0 && state.eo[10] == 0)) {
 
        cfopSolvedStates.cross.isSolved = true;
        cfopSolvedStates.cross.crossColor = Color.ORANGE;
        return;
    }

    // Check blue cross (UB, BL, DB, BR in right place)
    if ((state.ep[3] == 3 && state.ep[10] == 10 && state.ep[7] == 7 && state.ep[11] == 11) &&
        (state.eo[3] == 0 && state.eo[10] == 0 && state.eo[7] == 0 && state.eo[11] == 0)) {

        cfopSolvedStates.cross.isSolved = true;
        cfopSolvedStates.cross.crossColor = Color.BLUE;
        return;
    }

    // Check red cross (UR, FR, DR, BR in right place)
    if ((state.ep[0] == 0 && state.ep[8] == 8 && state.ep[4] == 4 && state.ep[11] == 11) &&
        (state.eo[0] == 0 && state.eo[8] == 0 && state.eo[4] == 0 && state.eo[11] == 0)) {

        cfopSolvedStates.cross.isSolved = true;
        cfopSolvedStates.cross.crossColor = Color.RED;
        return;
    }

    // Check yellow cross (DR, DF, DL, DB in right place)
    if ((state.ep[4] == 4 && state.ep[5] == 5 && state.ep[6] == 6 && state.ep[7] == 7) &&
        (state.eo[4] == 0 && state.eo[5] == 0 && state.eo[6] == 0 && state.eo[7] == 0)) {

        cfopSolvedStates.cross.isSolved = true;
        cfopSolvedStates.cross.crossColor = Color.YELLOW;
        return;
    }
}

/* -------------------------- Check Everything -------------------------- */

export function resetCfopSolvedStates() {
    cfopSolvedStates.cross.isSolved = false;
    cfopSolvedStates.cross.crossColor = null;
    cfopSolvedStates.f2l.isSolved = false;
    cfopSolvedStates.oll.isSolved = false;
    cfopSolvedStates.pll.isSolved = false;
}

export function checkCfopState(state: CubeState) {
    checkCrossSolved(state);

    // Do the rest
}