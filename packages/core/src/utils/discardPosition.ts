import { BoundingBox, CheckerTransform } from '../types';

export const discardPosition: CheckerTransform<BoundingBox> = boundingBox => ({
  ...boundingBox,
  top: NaN,
  right: NaN,
  bottom: NaN,
  left: NaN,
});
