export class Hex {
  private readonly parent: HexGrid;
  private readonly x: number;
  private readonly y: number;

  constructor(parent: HexGrid, x: number, y: number) {
    this.parent = parent;
    this.x = x;
    this.y = y;
  }

  get neighbors(): Hex[] {
    return this.parent.neighborsOf(this.x, this.y);
  }
}

export class HexGrid {
  private readonly hexArray: Hex[][]

  constructor(width: number, height: number) {
    this.hexArray = Array.from(new Array(height))
      .map((_, y) => Array.from(new Array(width))
        .map((_, x) => new Hex(this, x, y)));
  }

  at(x: number, y: number): Hex {
    return this.hexArray[y][x];
  }

  neighborsOf(x: number, y: number): Hex[] {
    const above = y - 1
    const below = y + 1
    const left = x - 1;
    const right = x + 1;
    const offset = y % 2 == 0 ? -1 : 1

    const row = this.hexArray[y];
    const aboveRow = (this.hexArray[above] || []);
    const belowRow = (this.hexArray[below] || []);

    const leftHex = row[left];
    const rightHex = row[right];
    const aboveHex = aboveRow[x];
    const belowHex = belowRow[x];
    const aboveHex2 = aboveRow[x + offset];
    const belowHex2 = belowRow[x + offset];

    return [
      leftHex,
      rightHex,
      aboveHex,
      belowHex,
      aboveHex2,
      belowHex2
    ]
      .filter(hex => hex !== undefined);
  }
}
