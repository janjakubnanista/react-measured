import { BoundingBox, CheckerTransform } from '../types';

export const discardSize: CheckerTransform<BoundingBox> = boundingBox => ({
  ...boundingBox,
  width: NaN,
  height: NaN,
});
