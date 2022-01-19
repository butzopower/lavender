export type D<Size extends number> = number extends Size ? number :_D<Size, [], [unknown]>;

type _D<Size extends number, Choices extends number[], Count extends unknown[]> =
  Choices['length'] extends Size ?
    Choices[number] :
    _D<Size, [...Choices, Count['length']], [...Count, unknown]>;

export interface Dice<T extends number> {
  roll(): D<T>
}