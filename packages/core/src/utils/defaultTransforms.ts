import { BoundingBox, CheckerTransform } from '../types';

export const discardPosition: CheckerTransform<BoundingBox> = boundingBox => ({
  width: boundingBox.width,
  height: boundingBox.height,
  top: NaN,
  right: NaN,
  bottom: NaN,
  left: NaN,
});

export const discardSize: CheckerTransform<BoundingBox> = boundingBox => ({
  top: boundingBox.top,
  right: boundingBox.right,
  bottom: boundingBox.bottom,
  left: boundingBox.left,
  width: NaN,
  height: NaN,
});
