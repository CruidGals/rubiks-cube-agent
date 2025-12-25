# Guide to Rubik's Cube Positional Notation

In the solved state, we can describe the positions of edges and corners in this following format:

$(CP, CO, EP, EO)$

Where $CP$ is corner permutation, $CO$ is corner orientation, $EP$ is edge permutation, and $EO$ is edge orientation. Each one of these values contains a list, corners from 0-7, and edges from 0-11. Here are the mappings for each corner and edge:

### Corner Positions

- **0**: URF (Up-Right-Front)
- **1**: UFL (Up-Front-Left)
- **2**: ULB (Up-Left-Back)
- **3**: UBR (Up-Back-Right)
- **4**: DFR (Down-Front-Right)
- **5**: DLF (Down-Left-Front)
- **6**: DBL (Down-Back-Left)
- **7**: DRB (Down-Right-Back)

### Edge Positions

- **0**: UR (Up-Right)
- **1**: UF (Up-Front)
- **2**: UL (Up-Left)
- **3**: UB (Up-Back)
- **4**: DR (Down-Right)
- **5**: DF (Down-Front)
- **6**: DL (Down-Left)
- **7**: DB (Down-Back)
- **8**: FR (Front-Right)
- **9**: FL (Front-Left)
- **10**: BL (Back-Left)
- **11**: BR (Back-Right)

## How to read coordinates

A solved rubik's cube state has these following values in the coordinate:

`CP = [0, 1, 2, 3, 4, 5, 6, 7]`

`CO = [0, 0, 0, 0, 0, 0, 0, 0]`

`EP = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`

`EO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`

CP and EP represent the positions of pieces, which are based on the index mapping above.

For CO, each piece mapping can be a value of `0, 1, 2`. This is the number of **twists** a corner is clockwise with respect to the reference frame. In the reference frame, the **white sticker** should always be facing upwards on the top layer, and facing downwards on the bottom layer to indicate correct orientation (0).

For EO, each piece can be a value of either `0, 1`. This just means that an edge can be a good edge (0) or bad edge (1) based on the current state. [Here is a good video to watch on this](https://www.youtube.com/watch?v=fxwVmTI5nGM&t=435s).

Say we do an R turn. Then the coordinates change like this:

`CP = [4, 1, 2, 0, 7, 5, 6, 3]`

`CO = [2, 0, 0, 1, 1, 0, 0, 2]`

`EP = [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0]`

`EO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`

See how in `CP`, the corners `0,3,4,7` move. This is because they were all currently in the `R` layer (as denoted in the mapping above). In `CO`, each layer is twisted by the relative reference frame as discussed above.

The edges in `EP` are moved also with the same intuition. Notice how `EO` remains as a zero vector, because we did not perform any `F` or `B` moves.

Now lets see what happens when we perform an `F` move:

`CP = [1, 5, 2, 3, 0, 4, 6, 7]`

`CO = [1, 2, 0, 0, 2, 1, 0, 0]`

`EP = [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11]`

`EO = [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]`

This time, turning the `F` layer made 4 of the edges in `EO` bad.

## Computational Optimization

All turns on the Rubik's cube have a specific way they transform the pieces, so it is highly recommended to **hardcode** these transformations. Here are the listed permutations for each coordinates:

*For any move not listed, assume that the pieces are not affected by it*

#### CP

```python
# Indices: 0:URF, 1:UFL, 2:ULB, 3:UBR, 4:DFR, 5:DLF, 6:DBL, 7:DRB
cp_moves = {
    'U': [3, 0, 1, 2, 4, 5, 6, 7], 
    'D': [0, 1, 2, 3, 5, 6, 7, 4], 
    'L': [0, 2, 6, 3, 4, 1, 5, 7], 
    'R': [4, 1, 2, 0, 7, 5, 6, 3], 
    'F': [1, 5, 2, 3, 0, 4, 6, 7], 
    'B': [0, 1, 3, 7, 4, 5, 2, 6],

    # Double moves
    'U2': [2, 3, 0, 1, 4, 5, 6, 7],
    'D2': [0, 1, 2, 3, 6, 7, 4, 5],
    'L2': [0, 6, 5, 3, 4, 2, 1, 7],
    'R2': [7, 1, 2, 4, 3, 5, 6, 0],
    'F2': [5, 4, 2, 3, 1, 0, 6, 7],
    'B2': [0, 1, 7, 6, 4, 5, 3, 2],

    # Prime moves
    "U'": [1, 2, 3, 0, 4, 5, 6, 7],
    "D'": [0, 1, 2, 3, 5, 6, 7, 4],
    "L'": [0, 5, 1, 3, 4, 6, 2, 7],
    "R'": [3, 1, 2, 7, 0, 5, 6, 4],
    "F'": [4, 0, 2, 3, 5, 1, 6, 7],
    "B'": [0, 1, 6, 2, 4, 5, 7, 3]

    # Rotation moves
    'x':  [4, 5, 1, 0, 7, 6, 2, 3],
    "x'": [3, 2, 6, 7, 0, 1, 5, 4],
    'x2': [7, 6, 5, 4, 3, 2, 1, 0],

    'y':  [3, 0, 1, 2, 7, 4, 5, 6],
    "y'": [1, 2, 3, 0, 5, 6, 7, 4],
    'y2': [2, 3, 0, 1, 6, 7, 4, 5],

    'z':  [1, 5, 6, 2, 0, 4, 7, 3],
    "z'": [4, 0, 3, 7, 5, 1, 2, 6],
    'z2': [5, 4, 7, 6, 1, 0, 3, 2]
}
```

#### CO
```python
# 0: No Twist, 1: CW, 2: CCW
co_twist = {
    'L': [0, 1, 2, 0, 0, 2, 1, 0], 
    'R': [2, 0, 0, 1, 1, 0, 0, 2],
    'F': [1, 2, 0, 0, 2, 1, 0, 0],
    'B': [0, 0, 1, 2, 0, 0, 2, 1],

    # Prime moves (same as regular moves)
    "L'": [0, 1, 2, 0, 0, 2, 1, 0],
    "R'": [2, 0, 0, 1, 1, 0, 0, 2],
    "F'": [1, 2, 0, 0, 2, 1, 0, 0],
    "B'": [0, 0, 1, 2, 0, 0, 2, 1],

    # Rotation moves
    'x':  [2, 1, 2, 1, 1, 2, 1, 2],
    "x'": [2, 1, 2, 1, 1, 2, 1, 2],

    'z':  [1, 2, 1, 2, 2, 1, 2, 1],
    "z'": [1, 2, 1, 2, 2, 1, 2, 1],
}
```

#### EP

```python
# Indices: 0-3 (Top), 4-7 (Bottom), 8-11 (Middle: FR, FL, BL, BR)
ep_moves = {
    'U': [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
    'D': [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11],
    'L': [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11],
    'R': [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0],
    'F': [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11],
    'B': [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7],

    # Double moves
    'U2': [2, 3, 0, 1, 4, 5, 6, 7, 8, 9, 10, 11],
    'D2': [0, 1, 2, 3, 6, 7, 4, 5, 8, 9, 10, 11],
    'L2': [0, 1, 6, 3, 4, 5, 2, 7, 8, 10, 9, 11],
    'R2': [4, 1, 2, 3, 0, 5, 6, 7, 11, 9, 10, 8],
    'F2': [0, 5, 2, 3, 4, 1, 6, 7, 9, 8, 10, 11],
    'B2': [0, 1, 2, 7, 4, 5, 6, 3, 8, 9, 11, 10],

    # Prime moves
    "U'": [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
    "D'": [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
    "L'": [0, 1, 9, 3, 4, 5, 10, 7, 8, 6, 2, 11],
    "R'": [11, 1, 2, 3, 8, 5, 6, 7, 0, 9, 10, 4],
    "F'": [0, 8, 2, 3, 4, 9, 6, 7, 5, 1, 10, 11],
    "B'": [0, 1, 2, 10, 4, 5, 6, 11, 8, 9, 7, 3],

    # Slice moves
    'M':  [0, 3, 2, 7, 4, 1, 6, 5, 8, 9, 10, 11],
    "M'": [0, 5, 2, 1, 4, 7, 6, 3, 8, 9, 10, 11],
    'M2': [0, 7, 2, 5, 4, 3, 6, 1, 8, 9, 10, 11],

    'E':  [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8],
    "E'": [0, 1, 2, 3, 4, 5, 6, 7, 11, 8, 9, 10],
    'E2': [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 8, 9],

    'S':  [2, 1, 6, 3, 0, 5, 4, 7, 8, 9, 10, 11],
    "S'": [4, 1, 0, 3, 6, 5, 2, 7, 8, 9, 10, 11],
    'S2': [6, 1, 4, 3, 2, 5, 0, 7, 8, 9, 10, 11],

    # Rotation moves
    'x':  [8, 5, 9, 1, 11, 7, 10, 3, 4, 6, 2, 0],
    "x'": [11, 3, 10, 7, 8, 1, 9, 5, 0, 2, 6, 4],
    'x2': [4, 7, 6, 5, 0, 3, 2, 1, 11, 10, 9, 8],

    'y':  [3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10],
    "y'": [1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8],
    'y2': [2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9],

    'z':  [2, 9, 6, 10, 0, 8, 4, 11, 1, 5, 7, 3],
    "z'": [4, 8, 0, 11, 6, 9, 2, 10, 5, 1, 3, 7],
    'z2': [6, 5, 4, 7, 2, 1, 0, 3, 9, 8, 11, 10]
}
```

#### EO
```python
eo_flip = {
    'F': [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0], # Indices 1, 5, 8, 9 flip
    'B': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]  # Indices 3, 7, 10, 11 flip

    # Prime moves
    "F'": [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    "B'": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],

    # Slice moves
    'S':  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    "S'": [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],

    # Rotation moves
    'z':  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "z'": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}
```

This is used in code to permute the corners and edges accurately and efficiently.