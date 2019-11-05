import { BoundingBox, CheckerTransform } from '../types';

export const discardPosition: CheckerTransform<BoundingBox> = boundingBox => ({
  ...boundingBox,
  top: NaN,
  right: NaN,
  bottom: NaN,
  left: NaN,
});

export const discardSize: CheckerTransform<BoundingBox> = boundingBox => ({
  ...boundingBox,
  width: NaN,
  height: NaN,
});
