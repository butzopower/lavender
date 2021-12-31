import { beforeEach, describe, it } from "mocha";
import { expect } from "chai";

class Hex {
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

class HexGrid {
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

// A B C
//  D E F
// Z Y X
//  W V U

describe('a hex grid', () => {
  describe('with a single hex', () => {
    it('has no neighbors', () => {
      const grid = new HexGrid(1, 1);
      const hex = grid.at(0, 0);
      expect(hex.neighbors).to.be.empty;
    });
  });

  describe('a completely horizontal map', () => {
    it('has neighbors left and right of tiles', () => {
      const grid = new HexGrid(5, 1);

      expect(grid.at(0, 0).neighbors).to.have.members([grid.at(1, 0)]);
      expect(grid.at(1, 0).neighbors).to.have.members([grid.at(0, 0), grid.at(2, 0)]);
      expect(grid.at(2, 0).neighbors).to.have.members([grid.at(1, 0), grid.at(3, 0)]);
      expect(grid.at(3, 0).neighbors).to.have.members([grid.at(2, 0), grid.at(4, 0)]);
      expect(grid.at(4, 0).neighbors).to.have.members([grid.at(3, 0)]);
    });
  });

  describe('a completely vertical map', () => {
    it('has neighbors above and below of tiles', () => {
      const grid = new HexGrid(1, 5);

      expect(grid.at(0, 0).neighbors).to.have.members([grid.at(0, 1)]);
      expect(grid.at(0, 1).neighbors).to.have.members([grid.at(0, 0), grid.at(0, 2)]);
      expect(grid.at(0, 2).neighbors).to.have.members([grid.at(0, 1), grid.at(0, 3)]);
      expect(grid.at(0, 3).neighbors).to.have.members([grid.at(0, 2), grid.at(0, 4)]);
      expect(grid.at(0, 4).neighbors).to.have.members([grid.at(0, 3)]);
    });
  });

  describe('a full map', () => {
    // A B C
    //  D E F
    // Z Y X
    //  W V U
    let grid: HexGrid;

    beforeEach(() => {
      grid = new HexGrid(3, 4);
    });

    it('A is neighbors to B and D', () => {
      expect(grid.at(0, 0).neighbors).to.have.members([grid.at(0, 1), grid.at(1, 0)]);
    });

    it('B is neighbors to A, C, D, and E', () => {
      expect(grid.at(1, 0).neighbors).to.have.members([
        grid.at(0, 0),
        grid.at(2, 0),
        grid.at(0, 1),
        grid.at(1, 1),
      ]);
    });

    it('C is neighbors to B, E, and F', () => {
      expect(grid.at(2, 0).neighbors).to.have.members([
        grid.at(1, 0),
        grid.at(1, 1),
        grid.at(2, 1),
      ]);
    });

    it('D is neighbors to A, B, E, Z, and Y', () => {
      expect(grid.at(0, 1).neighbors).to.have.members([
        grid.at(0, 0),
        grid.at(1, 0),
        grid.at(1, 1),
        grid.at(0, 2),
        grid.at(1, 2),
      ]);
    });

    it('E is neighbors to B, C, D, E, F, Y, and X', () => {
      expect(grid.at(1, 1).neighbors).to.have.members([
        grid.at(1, 0),
        grid.at(2, 0),
        grid.at(0, 1),
        grid.at(2, 1),
        grid.at(1, 2),
        grid.at(2, 2),
      ]);
    });

    it('F is neighbors to C, E, and X', () => {
      expect(grid.at(2, 1).neighbors).to.have.members([
        grid.at(2, 0),
        grid.at(1, 1),
        grid.at(2, 2),
      ]);
    });

    it('Z is neighbors to D, Y, and W', () => {
      expect(grid.at(0, 2).neighbors).to.have.members([
        grid.at(0, 1),
        grid.at(1, 2),
        grid.at(0, 3),
      ]);
    });

    it('Y is neighbors to D, E, Z, X, W, and V', () => {
      expect(grid.at(1, 2).neighbors).to.have.members([
        grid.at(0, 1),
        grid.at(1, 1),
        grid.at(0, 2),
        grid.at(2, 2),
        grid.at(0, 3),
        grid.at(1, 3),
      ]);
    });

    it('X is neighbors to E, F, Y, V, and U', () => {
      expect(grid.at(2, 2).neighbors).to.have.members([
        grid.at(1, 1),
        grid.at(2, 1),
        grid.at(1, 2),
        grid.at(1, 3),
        grid.at(2, 3),
      ]);
    });

    it('W is neighbors to Z, Y, and V', () => {
      expect(grid.at(0, 3).neighbors).to.have.members([
        grid.at(0, 2),
        grid.at(1, 2),
        grid.at(1, 3),
      ]);
    });

    it('V is neighbors to Y, X, W, and U', () => {
      expect(grid.at(1, 3).neighbors).to.have.members([
        grid.at(1, 2),
        grid.at(2, 2),
        grid.at(0, 3),
        grid.at(2, 3),
      ]);
    });

    it('U is neighbors to V and X', () => {
      expect(grid.at(2, 3).neighbors).to.have.members([
        grid.at(2, 2),
        grid.at(1, 3),
      ]);
    });
  });
});