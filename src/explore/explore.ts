import { Dice } from '../dice';
import { Hex, HexGrid } from '../hexgrid';

export type ExploreHandler = {
  prompt: (message: string) => boolean;
  movePartyTo: (hex: Hex) => void;
  rollFellowship: () => void;
}

export class Explore {
  private readonly dice: Dice<20>;

  constructor(dice: Dice<20>) {
    this.dice = dice;
  }

  explore(
    state: { partyLocation: Hex; map: HexGrid },
    to: Hex,
    handler: ExploreHandler,
  ) {
    const roll = this.dice.roll();

    if (roll >= 18) {
      handler.movePartyTo(to);
    } else if (roll >= 8) {
      handler.movePartyTo(to);
      handler.rollFellowship();
    } else {
      const didStepDown = handler.prompt("Miss: You may choose to step down the fellowship die and reach the desired hex or remain in the current hex.")

      if (didStepDown) {
        handler.movePartyTo(to);
      }
    }
  }
}