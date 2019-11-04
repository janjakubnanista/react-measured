import { BoundingBox } from 'react-bounding-box';

export const transformBoundingBoxToDocument = (boundingBox: BoundingBox): BoundingBox => ({
  width: boundingBox.width,
  height: boundingBox.height,
  top: boundingBox.top + window.pageYOffset,
  right: boundingBox.right + window.pageXOffset,
  bottom: boundingBox.bottom + window.pageYOffset,
  left: boundingBox.left + window.pageXOffset,
});
