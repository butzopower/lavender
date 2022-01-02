import { type Add } from './math';

export type D<T extends number> = number extends T ? number :_D<T, []>;
type _D<T extends number, R extends number[]> = R['length'] extends T ?
  R[number] :
  _D<T, [...R, Add<R['length'], 1>]>;

export interface Dice<T extends number> {
  roll(): D<T>
}