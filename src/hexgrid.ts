type InitHexFn<T> = (hex: Hex<T>) => T;

export class Hex<T = void> {
  private readonly parent: HexGrid<T>;
  readonly x: number;
  readonly y: number;
  content: T | undefined;

  constructor(parent: HexGrid<T>, x: number, y: number, initializeFn?: InitHexFn<T>) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.content = initializeFn? initializeFn(this) : undefined;
  }

  get neighbors(): Hex<T>[] {
    return this.parent.neighborsOf(this.x, this.y);
  }
}

export class HexGrid<T = void> {
  private readonly hexArray: Hex<T>[][]

  constructor(
    private width: number,
    private height: number,
    initializeFn?: InitHexFn<T>,
  ) {
    this.hexArray = Array.from(new Array(height))
      .map((_, y) => Array.from(new Array(width))
        .map((_, x) => new Hex(this, x, y, initializeFn)));
  }

  at(x: number, y: number): Hex<T> {
    return this.hexArray[y][x];
  }

  neighborsOf(x: number, y: number): Hex<T>[] {
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

  map<U>(mappingFunction: (x: Hex<T>) => U): HexGrid<U> {
    const originalHex = (hex: Hex<U>) => {
      return this.at(hex.x, hex.y);
    }

    return new HexGrid<U>(
      this.width,
      this.height,
      (hex) => mappingFunction(originalHex(hex))
    );
  }
}
