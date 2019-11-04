import { BoundingBox } from '../types';

export const buildBoundingBox = (boundingBox: Partial<BoundingBox> = {}): BoundingBox => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 100,
  height: 100,
  ...boundingBox,
});
