export type Add<N extends number, AmountToAdd extends number> = _Add<N, AmountToAdd, [], []>;
type _Add<
  N extends number,
  AmountToAdd extends number,
  LeftAmount extends unknown[],
  RightAmount extends unknown[]
  > =
  LeftAmount['length'] extends N ?
    RightAmount['length'] extends AmountToAdd ?
      [...LeftAmount, ...RightAmount]['length'] :
      _Add<N, AmountToAdd, LeftAmount, [unknown, ...RightAmount]> :
    _Add<N, AmountToAdd, [unknown, ...LeftAmount], []>

export type Sub<N extends number, AmountToSub extends number> = _Sub<N, AmountToSub, [], [], []>;
type _Sub<
  N extends number,
  AmountToSub extends number,
  Take extends unknown[],
  Left extends unknown[],
  All extends unknown[],
  > =
  All['length'] extends N ?
    Left['length'] :
    Take['length'] extends AmountToSub ?
      _Sub<N, AmountToSub, Take, [unknown, ...Left], [unknown, ...All]>:
      _Sub<N, AmountToSub, [unknown, ...Take], [], [unknown, ...All]>;