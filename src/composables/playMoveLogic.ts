import { CubeMove, isRotating, useCubeLogic, activeTween } from "./cubeLogic";
import { ref } from "vue";
import { isLowerCase } from "./util";
import { resetCube } from "./cubeVisual";
import { updateCubeState, resetCubeState } from "./cubeNotation";

export enum CallerType {
    player,
    computer
}

const { getComplimentMove, rotateFace, letterToCubeNotation } = useCubeLogic();

// There should be separate variables for player movement and computer playiong movement
export const isPlaying = ref(false);

// Store the list of moves
export const updatedCubeMoves = ref(false);
const cubeMoves = ref<CubeMove[]>([]);

// For dynamic movement
export const currPlaying = ref<boolean>(false);
export const moveCount = ref<number>(0);
export const currMove = ref<number>(0);

// Force move completion to prevent race condition
const isForcingMoveCompletion = ref(false);

// Track the last move played (for timer to check if it's a rotation move)
export const lastMove = ref<CubeMove | null>(null);

export function usePlayMoveLogic() {

    function prepareMove(event: KeyboardEvent) {
        // Don't turn the cube if it's rotating or playing moves
        if (isRotating.value) return null;

        // Make sure its a valid key
        if (!"rludfbmsexyzRLUDFBMSEXYZ".includes(event.key)) return null;

        return {face: letterToCubeNotation(event.key, event.ctrlKey), prime: event.shiftKey, double: false};
    }

    async function forceMoveCompletion() {
        // Don't interrupt player movement, but interrupt playing
        if (isRotating.value || !isPlaying.value) return;

        // Set the flag to ensure smooth stoppage
        isForcingMoveCompletion.value = true;

        // If currently playing or rotating, just stop it immediately
        isPlaying.value = false
        currPlaying.value = false;

        // Set the progress of the animation to complete
        if (activeTween.value) activeTween.value.progress(1);
    }

    // Read a set of moves (in a string), and return a queue
    async function readMoves(moves_str: string) {
        // Strategy: skip all whitespace
        // character must be a move or number 2
        let lines: string[] = moves_str.split(/\r?\n|\r|\n/g);
        let moves: CubeMove[] = [];

        // Set dynamic values to 0
        moveCount.value = 0;
        currMove.value = 0;

        for (const line of lines) {
            for (let i = 0; i < line.length; i++ ) {
                let move = line[i];

                // If found a comment (double slash), just end the loop
                if (move === "/" && (i < (line.length - 1) && line[i+1] === "/")) break;

                // Skip spaces, newline, and tabs
                if (" \t\n".includes(move)) continue;
                
                // Invalid character, skip and return nothing (not including 2 or ' because we parse that while parsing the move)
                if (!"rludfbxyzRLUDFBMSE".includes(move)) return -1;

                // Parse move
                let cubeMove: CubeMove = {face: letterToCubeNotation(move, isLowerCase(move)), prime: false, double: false};

                // Check if there's a prime or 2 after
                if (i < (line.length - 1)) {
                    if (line[i+1] === "'") { cubeMove.prime = true;  i++; }
                    if (line[i+1] === "2") { 
                        cubeMove.double = true; i++; 
                        if (line[i+1] === "'") { cubeMove.prime = true; i++; }
                    }
                }

                // Add it to list
                moves.push(cubeMove);
            }
        }

        updatedCubeMoves.value = true;
        moveCount.value = moves.length;
        cubeMoves.value = moves;

        // Signify success
        return 0;
    }

    // Plays a set of moves given
    async function playMove(move: CubeMove, turnSpeed: number, caller: CallerType) {
        // If already playing a set of moves, don't do it
        if (isRotating.value || isPlaying.value) return;

        // Track the last move (for timer to check if it's a rotation move)
        lastMove.value = move;

        // Begin playing the moves to the user
        caller == CallerType.player ? isRotating.value = true : isPlaying.value = true;
        await rotateFace(move, turnSpeed / 10);
        await updateCubeState(move);
        caller == CallerType.player ? isRotating.value = false : isPlaying.value = false;

        // Side effect of user move play, just reset the playingMoves variable
        if (caller == CallerType.player) currMove.value = 0;
    }

    async function playMoves(moves: string, turnSpeed: number) {
        // If already playing a set of moves, don't do it
        if (isRotating.value || isPlaying.value) return;

        // If haven't updated already (within the timeout), update it to play
        if (!updatedCubeMoves.value) await readMoves(moves);

        // If invalid, don't continue
        if (cubeMoves == null) {
            console.error("Error: invalid move combination.");
            return;
        }

        // If already reached the last move, go back to the front
        if (currMove.value == moveCount.value) currMove.value = 0;

        // Begin playing the moves to the user
        currPlaying.value = true;
        isPlaying.value = true;

        while (currPlaying.value && currMove.value < moveCount.value) {
            const currentMove = cubeMoves.value[currMove.value];
            await rotateFace(currentMove, turnSpeed / 10);
            await updateCubeState(currentMove);
            
            // Try to catch race condition with forceMoveCompletion()
            if (!isForcingMoveCompletion.value) currMove.value++;
            else isForcingMoveCompletion.value = false;
        }

        isPlaying.value = false;
        currPlaying.value = false;
    }

    // For playing a specific range of moves
    // Range is in form [start, end], inclusive ends
    async function playMoveRange(moves: string, turnSpeed: number, start: number, end: number) {
        // If already playing a set of moves, don't do it
        if (isRotating.value || isPlaying.value) return;

        // If haven't updated already (within the timeout), update it to play
        if (!updatedCubeMoves.value) await readMoves(moves);

        // If invalid, don't continue
        if (cubeMoves == null) {
            console.error("Error: invalid move combination.");
            return;
        }

        // See if going backwards (need to compliment every move if so)
        let backward = (end - start) < 0

        // Begin playing the moves to the user
        currPlaying.value = true;
        isPlaying.value = true;

        // Play moves while keeping race condition in mind
        if (backward) {
            while (currPlaying.value && start > end) {
                if (!isForcingMoveCompletion.value) start--;
                else isForcingMoveCompletion.value = false;

                const currentMove = getComplimentMove(cubeMoves.value[start]);
                await rotateFace(currentMove, turnSpeed / 10);
                await updateCubeState(currentMove);
            }
        } else {
            while (currPlaying.value && start < end) {
                const currentMove = cubeMoves.value[start];
                await rotateFace(currentMove, turnSpeed / 10);
                await updateCubeState(currentMove);
                
                if (!isForcingMoveCompletion.value) start++;
                else isForcingMoveCompletion.value = false;
            }
        }

        isPlaying.value = false;
        currPlaying.value = false;
    }

    // For stepping functions
    async function stepMove(turnSpeed: number, backward: boolean = false) {
        // Don't interrupt current rotations by the user
        if (isRotating.value) return;

        // DO interrupt current rotation by computer by stopping it imnmediately
        if (isPlaying.value) {
            await forceMoveCompletion();
            isForcingMoveCompletion.value = false;
            return;
        }

        // If stepping to the left
        if (backward) {
            // No more moves to the left, don't continue
            if (currMove.value <= 0) return;

            // Race condition
            if (!isForcingMoveCompletion.value) currMove.value--;
            else isForcingMoveCompletion.value = false;

            // Rotate backwards
            const currentMove = getComplimentMove(cubeMoves.value[currMove.value]);
            await playMove(currentMove, turnSpeed, CallerType.computer);
        } else {
            // No more moves to the right, don't continue
            if (currMove.value >= moveCount.value) return;
            
            // Rotate forwards
            const currentMove = cubeMoves.value[currMove.value];
            await playMove(currentMove, turnSpeed, CallerType.computer);
            
            // Race condition
            if (!isForcingMoveCompletion.value) currMove.value++;
            else isForcingMoveCompletion.value = false;
        }
    }

    // Handling reset cube
    async function onResetCube() {
        // Make sure nothing is being played during reset
        await forceMoveCompletion();

        // Reset eveyrthing
        resetCube();
        resetCubeState();
        currMove.value = 0;
    }
 
    return { prepareMove, forceMoveCompletion, readMoves, playMove, playMoves, playMoveRange, stepMove, onResetCube }
}