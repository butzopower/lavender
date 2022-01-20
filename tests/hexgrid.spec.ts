import { beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as fc from "fast-check";
import { HexGrid } from "../src/hexgrid";

describe('a hex grid', () => {
  describe('checking neighbors', () => {
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

      it('E is neighbors to B, C, D, F, Y, and X', () => {
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

  describe('constructing a grid', () => {
    it('allows hex content to be initialized', () => {
      fc.assert(fc.property(fc.anything(), thing => {
        const grid = new HexGrid<unknown>(1, 1, () => thing);

        expect(grid.at(0, 0).content).to.eql(thing);
      }));
    });

    it('passes the initializing hex to the initialize function', () => {
      const grid = new HexGrid<string>(3, 3, (hex) => `${hex.x},${hex.y}`);

      expect(grid.at(0, 0).content).to.eql('0,0');
      expect(grid.at(1, 0).content).to.eql('1,0');
      expect(grid.at(2, 0).content).to.eql('2,0');
      expect(grid.at(0, 1).content).to.eql('0,1');
      expect(grid.at(1, 1).content).to.eql('1,1');
      expect(grid.at(2, 1).content).to.eql('2,1');
      expect(grid.at(0, 2).content).to.eql('0,2');
      expect(grid.at(1, 2).content).to.eql('1,2');
      expect(grid.at(2, 2).content).to.eql('2,2');
    });
  });

  describe('mapping over the grid', () => {
    it('returns a new grid with the mapped values', () => {
      fc.assert(fc.property(fc.anything(), thing => {
        const originalGrid = new HexGrid<string>(1, 1, () => '');
        const grid = originalGrid.map(() => thing);

        expect(grid.at(0, 0).content).to.eql(thing);
      }));
    });

    it('passes the original hex properties into the function', () => {
      fc.assert(fc.property(fc.anything(), fc.anything(), (thing, thing2) => {
        const originalGrid = new HexGrid<unknown>(3, 3, () => thing);
        const grid = originalGrid.map((hex) => `${hex.x},${hex.y}`);

        expect(grid.at(0, 0).content).to.eql('0,0');
        expect(grid.at(1, 0).content).to.eql('1,0');
        expect(grid.at(2, 0).content).to.eql('2,0');
        expect(grid.at(0, 1).content).to.eql('0,1');
        expect(grid.at(1, 1).content).to.eql('1,1');
        expect(grid.at(2, 1).content).to.eql('2,1');
        expect(grid.at(0, 2).content).to.eql('0,2');
        expect(grid.at(1, 2).content).to.eql('1,2');
        expect(grid.at(2, 2).content).to.eql('2,2');
      }));
    });

    it('passes the original hex content into the function', () => {
      fc.assert(fc.property(fc.anything(), fc.anything(), (thing, thing2) => {
        const originalGrid = new HexGrid<unknown>(1, 1, () => thing);
        const grid = originalGrid.map((x) => `${JSON.stringify(x.content)}|${JSON.stringify(thing2)}`);

        expect(grid.at(0, 0).content).to.eql(`${JSON.stringify(thing)}|${JSON.stringify(thing2)}`);
      }));
    });
  });
});

describe('a hex', () => {
  it('can store content', () => {
    fc.assert(fc.property(fc.anything(), thing => {
      const grid = new HexGrid<unknown>(1, 1);
      const hex = grid.at(0, 0);

      hex.content = thing;
      expect(grid.at(0, 0).content).to.eql(thing);
    }));
  });
})