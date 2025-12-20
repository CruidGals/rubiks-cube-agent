import { CubeMove, isRotating, turnSpeed, useCubeLogic, activeTween } from "./cubeLogic";
import { ref } from "vue";
import { isLowerCase } from "./util";

const { rotateFace, letterToCubeNotation } = useCubeLogic();

// Store the list of moves
export const updatedCubeMoves = ref(false);
const cubeMoves = ref<CubeMove[]>([]);

// For dynamic movement
export const currPlaying = ref<boolean>(false);
export const moveCount = ref<number>(0);
export const currMove = ref<number>(0);

export function usePlayMoveLogic() {

    function prepareMove(event: KeyboardEvent) {
        // Don't turn the cube if it's rotating or playing moves
        if (isRotating.value) return null;

        // Make sure its a valid key
        if (!"rludfbmsexyzRLUDFBMSEXYZ".includes(event.key)) return null;

        return {face: letterToCubeNotation(event.key, event.ctrlKey), prime: event.shiftKey, double: false};
    }

    // Plays a set of moves given
    async function playMove(move: CubeMove) {
        // If already playing a set of moves, don't do it
        if (isRotating.value) return;

        // Begin playing the moves to the user
        isRotating.value = true;
        await rotateFace(move, turnSpeed.value / 10);
        isRotating.value = false;
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

    async function playMoves(moves: string) {
        // If already playing a set of moves, don't do it
        if (isRotating.value) return;

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
        isRotating.value = true;

        while (currPlaying.value && currMove.value < moveCount.value) {
            await rotateFace(cubeMoves.value[currMove.value], turnSpeed.value / 10);
            currMove.value++;
        }

        isRotating.value = false;
        currPlaying.value = false;
    }

    function forceMoveCompletion() {
        // If currently playing or rotating, just stop it immediately
        isRotating.value = false;
        currPlaying.value = false;

        // Set the progress of the animation to complete
        if (activeTween.value) activeTween.value.progress(1);
    }

    return { prepareMove, readMoves, playMove, playMoves, forceMoveCompletion }
}