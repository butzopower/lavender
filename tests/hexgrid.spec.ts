import { describe, it } from "mocha";
import { expect } from "chai";

class Hex {
  private readonly parent: HexGrid;
  private readonly x: number;
  private readonly y: number;

  constructor(parent: HexGrid, x: number) {
    this.parent = parent;
    this.x = x;
    this.y = 0;
  }

  get neighbors(): Hex[] {
    return this.parent.neighborsOf(this.x, this.y);
  }
}

class HexGrid {
  private readonly hexArray: Hex[]

  constructor(width: number, height: number) {
    const size = width * height;
    this.hexArray = Array.from(new Array(size)).map((_, x) => new Hex(this, x));
  }

  at(x: number, y: number): Hex {
    return this.hexArray[x];
  }

  neighborsOf(x: number, y: number): Hex[] {
    const left = x - 1;
    const right = x + 1;

    return [this.hexArray[left], this.hexArray[right]]
      .filter(hex => hex !== undefined);
  }
}

describe('a hex grid', () => {
  describe('with a single hex', () => {
    it('has no neighbors', () => {
      const grid = new HexGrid(1, 1);
      const hex = grid.at(0,0);
      expect(hex.neighbors).to.be.empty;
    });
  });

  describe('a completely horizontal map', () => {
    it('has neighbors left and right of tiles', () => {
      const grid = new HexGrid(5, 1);

      expect(grid.at(0,0).neighbors).to.have.members([grid.at(1,0)]);
      expect(grid.at(1,0).neighbors).to.have.members([grid.at(0,0), grid.at(2,0)]);
      expect(grid.at(2,0).neighbors).to.have.members([grid.at(1,0), grid.at(3,0)]);
      expect(grid.at(3,0).neighbors).to.have.members([grid.at(2,0), grid.at(4,0)]);
      expect(grid.at(4,0).neighbors).to.have.members([grid.at(3,0)]);
    });
  });
});