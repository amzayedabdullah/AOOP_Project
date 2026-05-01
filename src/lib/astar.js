// Textbook A* over an integer grid. Follows Wikipedia's pseudocode line by line:
// https://en.wikipedia.org/wiki/A*_search_algorithm. This is intentionally not a
// library wrapper — the whole search is small enough to read end-to-end and is
// easier to debug when you can step through it.

// ---- Min-heap (priority queue) ----------------------------------------------
// Stored as a plain array of [item, key] tuples. ~25 lines.
function heapPush(heap, item, key) {
  heap.push([item, key]);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (heap[parent][1] <= heap[i][1]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
}

function heapPop(heap) {
  if (heap.length === 0) return null;
  const top = heap[0];
  const last = heap.pop();
  if (heap.length > 0) {
    heap[0] = last;
    let i = 0;
    const n = heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && heap[left][1] < heap[smallest][1]) smallest = left;
      if (right < n && heap[right][1] < heap[smallest][1]) smallest = right;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
      i = smallest;
    }
  }
  return top;
}

// ---- Heuristic --------------------------------------------------------------
// Octile distance — the natural fit for 8-neighbor grids with √2 diagonal cost.
const SQRT2 = Math.SQRT2;

export function octileDistance(a, b) {
  const dx = Math.abs(a[0] - b[0]);
  const dy = Math.abs(a[1] - b[1]);
  return (dx + dy) + (SQRT2 - 2) * Math.min(dx, dy);
}

// ---- A* ---------------------------------------------------------------------
// grid:    { cols, rows, costs }  — costs is row-major: costs[col + row*cols]
// start:   [col, row]
// goal:    [col, row]
// returns: { path: [[col,row],…], cost } | null
const NEIGHBORS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

export function findPath(grid, start, goal) {
  const { cols, rows, costs } = grid;
  const keyOf = (col, row) => col * rows + row;
  const inBounds = (col, row) => col >= 0 && col < cols && row >= 0 && row < rows;

  const startKey = keyOf(start[0], start[1]);
  const goalKey = keyOf(goal[0], goal[1]);

  // gScore[n]   = best known cost from start to n
  // fScore[n]   = gScore[n] + heuristic(n, goal)
  // cameFrom[n] = the neighbor on the cheapest path to n
  const gScore = new Map();
  const cameFrom = new Map();

  gScore.set(startKey, 0);

  const open = [];
  heapPush(open, start, octileDistance(start, goal));

  while (open.length > 0) {
    const popped = heapPop(open);
    const current = popped[0];
    const currentKey = keyOf(current[0], current[1]);

    if (currentKey === goalKey) {
      // Reconstruct the path by walking cameFrom backward from the goal.
      const path = [current];
      let walker = currentKey;
      while (cameFrom.has(walker)) {
        const prev = cameFrom.get(walker);
        path.push(prev);
        walker = keyOf(prev[0], prev[1]);
      }
      path.reverse();
      return { path, cost: gScore.get(goalKey) };
    }

    for (const [dCol, dRow] of NEIGHBORS) {
      const nCol = current[0] + dCol;
      const nRow = current[1] + dRow;
      if (!inBounds(nCol, nRow)) continue;

      const neighborKey = keyOf(nCol, nRow);
      const neighborCellCost = costs[nCol + nRow * cols];
      // Cost to step into this neighbor: 1 (orthogonal) or √2 (diagonal),
      // plus the destination cell's own cost.
      const moveCost = (dCol !== 0 && dRow !== 0) ? SQRT2 : 1;
      const tentativeG = gScore.get(currentKey) + moveCost + neighborCellCost;

      const previousG = gScore.has(neighborKey) ? gScore.get(neighborKey) : Infinity;
      if (tentativeG < previousG) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        const fScore = tentativeG + octileDistance([nCol, nRow], goal);
        heapPush(open, [nCol, nRow], fScore);
      }
    }
  }

  return null;
}
