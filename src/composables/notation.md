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

`EP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`

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

## Notation Mapping Strategy

Dealing with `x`, `y`, and `z` rotations are extremely difficult to map in memory, so every turn is going to be relative to the center position of **white top, green front**. This means that as the center orientations change, we will have to convert moves so that they are relative to what they would be if the center was white top green front.

For example: say your centers are in the position of **orange top green front**. If I perform a **U** move in this position, this would translate to an **L'** move on the white top green front center orientation.

Another example: say my centers are **white top green front**, and I perform an M move. This is essentially just an **R and L'** move at the same time relative to white top green front. Of course the centers change to green top yellow front, however, this is the consequence of fixing moves to white top green front.

All these computations are encoded in the **fixed move** functions, and also mapped in predefined constants at the top of the file.

## Computational Optimization

All turns on the Rubik's cube have a specific way they transform the pieces, so it is highly recommended to **hardcode** these transformations. Here are the listed permutations for each coordinates:

*For any move not listed, assume that the pieces are not affected by it*

#### CP

```python
# Indices: 0:URF, 1:UFL, 2:ULB, 3:UBR, 4:DFR, 5:DLF, 6:DBL, 7:DRB
cp_moves = {
    # Regular moves
    'U': [1, 2, 3, 0, 4, 5, 6, 7], 
    'D': [0, 1, 2, 3, 7, 4, 5, 6], 
    'L': [0, 5, 1, 3, 4, 6, 2, 7], 
    'R': [3, 1, 2, 7, 0, 5, 6, 4], 
    'F': [4, 0, 2, 3, 5, 1, 6, 7], 
    'B': [0, 1, 6, 2, 4, 5, 7, 3],

    # Wide moves (r, l, u, d, f, b)
    'r': [0, 5, 1, 3, 4, 6, 2, 7],  # Same as L
    'l': [3, 1, 2, 7, 0, 5, 6, 4],  # Same as R
    'u': [0, 1, 2, 3, 7, 4, 5, 6],  # Same as D
    'd': [1, 2, 3, 0, 4, 5, 6, 7],  # Same as U
    'f': [0, 1, 6, 2, 4, 5, 7, 3],  # Same as B
    'b': [4, 0, 2, 3, 5, 1, 6, 7],  # Same as F

    # Double moves
    'U2': [2, 3, 0, 1, 4, 5, 6, 7],
    'D2': [0, 1, 2, 3, 6, 7, 4, 5],
    'L2': [0, 6, 5, 3, 4, 2, 1, 7],
    'R2': [7, 1, 2, 4, 3, 5, 6, 0],
    'F2': [5, 4, 2, 3, 1, 0, 6, 7],
    'B2': [0, 1, 7, 6, 4, 5, 3, 2],
    'r2': [0, 6, 5, 3, 4, 2, 1, 7],  # Same as L2
    'l2': [7, 1, 2, 4, 3, 5, 6, 0],  # Same as R2
    'u2': [0, 1, 2, 3, 6, 7, 4, 5],  # Same as D2
    'd2': [2, 3, 0, 1, 4, 5, 6, 7],  # Same as U2
    'f2': [0, 1, 7, 6, 4, 5, 3, 2],  # Same as B2
    'b2': [5, 4, 2, 3, 1, 0, 6, 7],  # Same as F2

    # Prime moves
    "U'": [3, 0, 1, 2, 4, 5, 6, 7],
    "D'": [0, 1, 2, 3, 5, 6, 7, 4],
    "L'": [0, 2, 6, 3, 4, 1, 5, 7],
    "R'": [4, 1, 2, 0, 7, 5, 6, 3],
    "F'": [1, 5, 2, 3, 0, 4, 6, 7],
    "B'": [0, 1, 3, 7, 4, 5, 2, 6],
    "r'": [0, 2, 6, 3, 4, 1, 5, 7],  # Same as L'
    "l'": [4, 1, 2, 0, 7, 5, 6, 3],  # Same as R'
    "u'": [0, 1, 2, 3, 5, 6, 7, 4],  # Same as D'
    "d'": [3, 0, 1, 2, 4, 5, 6, 7],  # Same as U'
    "f'": [0, 1, 3, 7, 4, 5, 2, 6],  # Same as B'
    "b'": [1, 5, 2, 3, 0, 4, 6, 7],  # Same as F'

    # Slice moves
    'M':  [3, 2, 6, 7, 0, 1, 5, 4],
    "M'": [4, 5, 1, 0, 7, 6, 2, 3],
    'M2': [7, 6, 5, 4, 3, 2, 1, 0],
    'E':  [1, 2, 3, 0, 5, 6, 7, 4],
    "E'": [3, 0, 1, 2, 7, 4, 5, 6],
    'E2': [2, 3, 0, 1, 6, 7, 4, 5],
    'S':  [1, 5, 6, 2, 0, 4, 7, 3],
    "S'": [4, 0, 3, 7, 5, 1, 2, 6],
    'S2': [5, 4, 7, 6, 1, 0, 3, 2]
}
```

#### CO
```python
# 0: No Twist, 1: CW, 2: CCW
# Note: Double moves don't affect orientation
co_twist = {
    # Regular moves
    'L': [0, 1, 2, 0, 0, 2, 1, 0], 
    'R': [2, 0, 0, 1, 1, 0, 0, 2],
    'F': [1, 2, 0, 0, 2, 1, 0, 0],
    'B': [0, 0, 1, 2, 0, 0, 2, 1],

    # Wide moves (r, l, f, b)
    'r': [0, 1, 2, 0, 0, 2, 1, 0],  # Same as L
    'l': [2, 0, 0, 1, 1, 0, 0, 2],  # Same as R
    'f': [0, 0, 1, 2, 0, 0, 2, 1],  # Same as B
    'b': [1, 2, 0, 0, 2, 1, 0, 0],  # Same as F

    # Prime moves (same as regular moves)
    "L'": [0, 1, 2, 0, 0, 2, 1, 0],
    "R'": [2, 0, 0, 1, 1, 0, 0, 2],
    "F'": [1, 2, 0, 0, 2, 1, 0, 0],
    "B'": [0, 0, 1, 2, 0, 0, 2, 1],
    "r'": [0, 1, 2, 0, 0, 2, 1, 0],  # Same as L'
    "l'": [2, 0, 0, 1, 1, 0, 0, 2],  # Same as R'
    "f'": [0, 0, 1, 2, 0, 0, 2, 1],  # Same as B'
    "b'": [1, 2, 0, 0, 2, 1, 0, 0],  # Same as F'

    # Slice moves
    'M':  [2, 1, 2, 1, 1, 2, 1, 2],
    "M'": [2, 1, 2, 1, 1, 2, 1, 2],
    'S':  [1, 2, 1, 2, 2, 1, 2, 1],
    "S'": [1, 2, 1, 2, 2, 1, 2, 1]
}
```

#### EP

```python
# Indices: 0-3 (Top), 4-7 (Bottom), 8-11 (Middle: FR, FL, BL, BR)
ep_moves = {
    # Regular moves
    'U': [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
    'D': [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
    'L': [0, 1, 9, 3, 4, 5, 10, 7, 8, 6, 2, 11],
    'R': [11, 1, 2, 3, 8, 5, 6, 7, 0, 9, 10, 4],
    'F': [0, 8, 2, 3, 4, 9, 6, 7, 5, 1, 10, 11],
    'B': [0, 1, 2, 10, 4, 5, 6, 11, 8, 9, 7, 3],

    # Wide moves (r, l, u, d, f, b)
    # Note: In code, R and l are grouped, L and r are grouped, etc.
    'r': [0, 1, 9, 3, 4, 5, 10, 7, 8, 6, 2, 11],  # Same as L
    'l': [11, 1, 2, 3, 8, 5, 6, 7, 0, 9, 10, 4],  # Same as R
    'u': [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],  # Same as D
    'd': [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],  # Same as U
    'f': [0, 1, 2, 10, 4, 5, 6, 11, 8, 9, 7, 3],  # Same as B
    'b': [0, 8, 2, 3, 4, 9, 6, 7, 5, 1, 10, 11],  # Same as F

    # Double moves
    'U2': [2, 3, 0, 1, 4, 5, 6, 7, 8, 9, 10, 11],
    'D2': [0, 1, 2, 3, 6, 7, 4, 5, 8, 9, 10, 11],
    'L2': [0, 1, 6, 3, 4, 5, 2, 7, 8, 10, 9, 11],
    'R2': [4, 1, 2, 3, 0, 5, 6, 7, 11, 9, 10, 8],
    'F2': [0, 5, 2, 3, 4, 1, 6, 7, 9, 8, 10, 11],
    'B2': [0, 1, 2, 7, 4, 5, 6, 3, 8, 9, 11, 10],
    'r2': [0, 1, 6, 3, 4, 5, 2, 7, 8, 10, 9, 11],  # Same as L2
    'l2': [4, 1, 2, 3, 0, 5, 6, 7, 11, 9, 10, 8],  # Same as R2
    'u2': [0, 1, 2, 3, 6, 7, 4, 5, 8, 9, 10, 11],  # Same as D2
    'd2': [2, 3, 0, 1, 4, 5, 6, 7, 8, 9, 10, 11],  # Same as U2
    'f2': [0, 1, 2, 7, 4, 5, 6, 3, 8, 9, 11, 10],  # Same as B2
    'b2': [0, 5, 2, 3, 4, 1, 6, 7, 9, 8, 10, 11],  # Same as F2

    # Prime moves
    "U'": [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
    "D'": [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11],
    "L'": [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11],
    "R'": [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0],
    "F'": [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11],
    "B'": [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7],
    "r'": [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11],  # Same as L'
    "l'": [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0],  # Same as R'
    "u'": [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11],  # Same as D'
    "d'": [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],  # Same as U'
    "f'": [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7],  # Same as B'
    "b'": [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11],  # Same as F'

    # Slice moves
    'M':  [11, 1, 10, 3, 8, 5, 9, 7, 0, 2, 6, 4],
    "M'": [8, 1, 9, 3, 11, 5, 10, 7, 4, 6, 2, 0],
    'M2': [4, 1, 6, 3, 0, 5, 2, 7, 11, 10, 9, 8],
    'E':  [1, 2, 3, 0, 5, 6, 7, 4, 8, 9, 10, 11],
    "E'": [3, 0, 1, 2, 7, 4, 5, 6, 8, 9, 10, 11],
    'E2': [2, 3, 0, 1, 6, 7, 4, 5, 8, 9, 10, 11],
    'S':  [0, 9, 2, 10, 4, 8, 6, 11, 1, 5, 7, 3],
    "S'": [0, 8, 2, 11, 4, 9, 6, 10, 5, 1, 3, 7],
    'S2': [0, 5, 2, 7, 4, 1, 6, 3, 9, 8, 11, 10]
}
```

#### EO
```python
# 0: Good edge, 1: Bad edge
# Note: Double moves don't affect orientation
eo_flip = {
    # Regular moves
    'F': [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],  # Indices 1, 5, 8, 9 flip
    'B': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],  # Indices 3, 7, 10, 11 flip

    # Wide moves (f, b)
    'f': [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],  # Same as F
    'b': [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],  # Same as B

    # Prime moves (same as regular moves)
    "F'": [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    "B'": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
    "f'": [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],  # Same as F'
    "b'": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],  # Same as B'

    # Slice moves
    'S':  [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    "S'": [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1]
}
```

#### Centers

```python
# Indices: 0:White, 1:Green, 2:Orange, 3:Blue, 4:Red, 5:Yellow
center_moves = {
    # Rotation moves (x, y, z)
    'x':  [3, 0, 2, 5, 4, 1],
    "x'": [1, 5, 2, 0, 4, 3],
    'x2': [5, 3, 2, 1, 4, 0],
    'y':  [0, 2, 3, 4, 1, 5],
    "y'": [0, 4, 1, 2, 3, 5],
    'y2': [0, 3, 4, 1, 2, 5],
    'z':  [4, 1, 0, 3, 5, 2],
    "z'": [2, 1, 5, 3, 0, 4],
    'z2': [5, 1, 4, 3, 2, 0],

    # Wide moves that affect centers (r, l, u, d, f, b)
    'r':  [3, 0, 2, 5, 4, 1],  # Same as x
    "r'": [1, 5, 2, 0, 4, 3],  # Same as x'
    'r2': [5, 3, 2, 1, 4, 0],  # Same as x2
    'l':  [1, 5, 2, 0, 4, 3],  # Same as x'
    "l'": [3, 0, 2, 5, 4, 1],  # Same as x
    'l2': [5, 3, 2, 1, 4, 0],  # Same as x2
    'u':  [0, 2, 3, 4, 1, 5],  # Same as y
    "u'": [0, 4, 1, 2, 3, 5],  # Same as y'
    'u2': [0, 3, 4, 1, 2, 5],  # Same as y2
    'd':  [0, 4, 1, 2, 3, 5],  # Same as y'
    "d'": [0, 2, 3, 4, 1, 5],  # Same as y
    'd2': [0, 3, 4, 1, 2, 5],  # Same as y2
    'f':  [4, 1, 0, 3, 5, 2],  # Same as z
    "f'": [2, 1, 5, 3, 0, 4],  # Same as z'
    'f2': [5, 1, 4, 3, 2, 0],  # Same as z2
    'b':  [2, 1, 5, 3, 0, 4],  # Same as z'
    "b'": [4, 1, 0, 3, 5, 2],  # Same as z
    'b2': [5, 1, 4, 3, 2, 0],  # Same as z2

    # Slice moves that affect centers (M, E, S)
    'M':  [1, 5, 2, 0, 4, 3],  # Same as x'
    "M'": [3, 0, 2, 5, 4, 1],  # Same as x
    'M2': [5, 3, 2, 1, 4, 0],  # Same as x2
    'E':  [0, 4, 1, 2, 3, 5],  # Same as y'
    "E'": [0, 2, 3, 4, 1, 5],  # Same as y
    'E2': [0, 3, 4, 1, 2, 5],  # Same as y2
    'S':  [4, 1, 0, 3, 5, 2],  # Same as z
    "S'": [2, 1, 5, 3, 0, 4],  # Same as z'
    'S2': [5, 1, 4, 3, 2, 0]   # Same as z2
}
```

This is used in code to permute the corners, edges, and centers accurately and efficiently.