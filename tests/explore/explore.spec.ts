import { describe, it } from 'mocha';
import { SinonSpy, spy } from 'sinon';
import { expect } from 'chai';

import { HexGrid } from '../../src/hexgrid';
import { Dice } from '../../src/dice';
import { Explore, ExploreHandler } from '../../src/explore/explore';

const strongSuccessDie: Dice<20> = {
   roll: () => 19
}

const weakSuccessDie: Dice<20> = {
   roll: () => 12
}

const missDie: Dice<20> = {
   roll: () => 4
}

const dummy: (...args: any[]) => never = (...args: any[]) => {
   throw Error(`not meant to be called, called with ${args}`);
};

describe('exploring', () => {
   let handler: ExploreHandler

   beforeEach(() => {
      handler = {
         movePartyTo: dummy,
         rollFellowship: dummy,
         prompt: dummy,
      }
   });

   describe('the procedure "Guide the Company"', () => {
      describe('strong success', () => {
         it('moves and reveals the new hex', () => {
            const map = new HexGrid(2, 1);

            const explore = new Explore(strongSuccessDie);
            const movePartyToSpy = spy();
            handler.movePartyTo = movePartyToSpy;

            explore.explore(
              { partyLocation: map.at(0, 0), map },
              map.at(1, 0),
              handler
            );

            expect(movePartyToSpy.lastCall.args).to.eql([map.at(1, 0)]);
         });
      });

      describe('weak success', () => {
         const map = new HexGrid(2, 1);
         let movePartyToSpy: SinonSpy;
         let rollFellowshipSpy: SinonSpy

         beforeEach(() => {
            movePartyToSpy = spy();
            rollFellowshipSpy = spy();

            handler.movePartyTo = movePartyToSpy;
            handler.rollFellowship = rollFellowshipSpy;

            const explore = new Explore(weakSuccessDie);

            explore.explore(
              { partyLocation: map.at(0, 0), map },
              map.at(1, 0),
              handler
            );
         });

         it('moves and reveals the new hex', () => {
            expect(movePartyToSpy.lastCall.args).to.eql([map.at(1, 0)]);
         });

         it('requires fellowship die roll', () => {
            expect(rollFellowshipSpy.called).to.be.true
         });
      });

      describe('miss', () => {
         it('prompts to step down the fellowship die', () => {
            const map = new HexGrid(2, 1);
            const explore = new Explore(missDie);

            const promptSpy = spy();
            handler.prompt = promptSpy;

            explore.explore(
              { partyLocation: map.at(0, 0), map },
              map.at(1, 0),
              handler
            );

            expect(promptSpy.lastCall.args).to.eql(["Miss: You may choose to step down the fellowship die and reach the desired hex or remain in the current hex."]);
         });

         describe('fellowship die stepped down', () => {
            it('moves and reveals the new hex', () => {
               const map = new HexGrid(2, 1);
               const explore = new Explore(missDie);

               const movePartyToSpy = spy();

               handler.prompt = () => true;
               handler.movePartyTo = movePartyToSpy;

               explore.explore(
                 { partyLocation: map.at(0, 0), map },
                 map.at(1, 0),
                 handler
               );

               expect(movePartyToSpy.lastCall.args).to.eql([map.at(1, 0)]);
            });
         });

         describe('fellowship die not stepped down', () => {
            it('keeps party in current hex', () => {
               const map = new HexGrid(2, 1);
               const explore = new Explore(missDie);

               const movePartyToSpy = spy();

               handler.prompt = () => false;
               handler.movePartyTo = movePartyToSpy;

               explore.explore(
                 { partyLocation: map.at(0, 0), map },
                 map.at(1, 0),
                 handler
               );

               expect(movePartyToSpy.called).to.eql(false);
            });
         });
      });
   });
});