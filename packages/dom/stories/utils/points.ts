import { BoundingBox } from '@react-width-height/core';

export const left = (box: BoundingBox | undefined, dx = 0, dy = 0): BoundingBox | undefined =>
  box
    ? {
        ...box,
        width: 0,
        height: 0,
        top: box.top + box.height / 2 + dy,
        right: box.left + dx,
        bottom: box.top + box.height / 2 + dy,
        left: box.left + dx,
      }
    : undefined;

export const right = (box: BoundingBox | undefined, dx = 0, dy = 0): BoundingBox | undefined =>
  box
    ? {
        ...box,
        width: 0,
        height: 0,
        top: box.top + box.height / 2 + dy,
        right: box.right + dx,
        bottom: box.top + box.height / 2 + dy,
        left: box.right + dx,
      }
    : box;
