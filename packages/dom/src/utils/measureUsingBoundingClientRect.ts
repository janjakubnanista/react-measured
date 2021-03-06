import { BoundingBox } from 'react-measured';

export const measureUsingBoundingClientRect = (element: HTMLElement): BoundingBox => {
  const boundingBox = element.getBoundingClientRect();

  return {
    width: boundingBox.width,
    height: boundingBox.height,
    top: boundingBox.top,
    right: boundingBox.right,
    bottom: boundingBox.bottom,
    left: boundingBox.left,
  };
};
