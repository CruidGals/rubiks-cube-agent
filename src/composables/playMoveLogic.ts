import { CubeMove, letterToCubeNotation } from "./cubeLogic";
import { ref } from "vue";
import { isLowerCase } from "./util";

// Store the list of moves
export const updatedCubeMoves = ref(false);
export const cubeMoves = ref<CubeMove[]>([]);

// For dynamic movement
export const moveCount = ref<number>(0);
export const currMove = ref<number>(0);

// Read a set of moves (in a string), and return a queue
export async function readMoves(moves_str: string) {
    // Strategy: skip all whitespace
    // character must be a move or number 2
    let lines: string[] = moves_str.split(/\r?\n|\r|\n/g);
    let moves: CubeMove[] = [];

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
    cubeMoves.value = moves;

    // Signify success
    return 0;
}