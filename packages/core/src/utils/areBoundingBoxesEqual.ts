import { BoundingBox } from '../types';

const EPSILON = 1e-3;

const areNumbersEqual = (a: number, b: number, precision: number): boolean =>
  (isNaN(a) && isNaN(b)) || Math.abs(a - b) <= precision;

export const areBoundingBoxesEqual = (
  boundingBox: BoundingBox,
  previousBoundingBox: BoundingBox | undefined,
  precision = EPSILON,
): boolean =>
  !!previousBoundingBox &&
  areNumbersEqual(boundingBox.left, previousBoundingBox.left, precision) &&
  areNumbersEqual(boundingBox.top, previousBoundingBox.top, precision) &&
  areNumbersEqual(boundingBox.width, previousBoundingBox.width, precision) &&
  areNumbersEqual(boundingBox.height, previousBoundingBox.height, precision);
