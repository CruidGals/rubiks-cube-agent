export function isLowerCase(char: string): boolean { return char === char.toLowerCase() && char !== char.toUpperCase(); }

function hasDuplicates(arr: any[]): boolean { return new Set(arr).size !== arr.length; }
function isWithinRange(arr: number[], min: number, max: number) { return arr.every(val => val >= min && val <= max); }

// Permutes the elements in arr with the mapping
export function permute(arr: any[], mapping: number[]) {
    
    // Ensure arr and mapping are same length
    if (arr.length != mapping.length) {
        console.error("Array and mapping not same length; cannot permute.");
        return;
    }

    // Validate mapping array
    if (hasDuplicates(mapping) || isWithinRange(mapping, 0, arr.length - 1) ) {
        console.error("Mapping has duplicates are not within range of arr.length.");
        return;
    }

    // Create new array same length as arr
    let newArr = new Array(arr.length);

    // Put elements of array into correct location
    arr.forEach((value, idx) => {
        newArr[mapping[idx]] = value;
    })

    // Return the array
    return newArr;
}