import { CheckerItem, createInNextFrame, Checker, createAnimationFrameChecker } from 'react-measured';
import { areBoundingBoxesEqual } from 'react-measured';
import { measureUsingBoundingClientRect } from '../utils/measureUsingBoundingClientRect';

// An internal type used for passing callbacks to be executed between animation frames
type CheckerUpdateCallback = () => void;

export const createHTMLChecker = (): Checker<HTMLElement> => {
  const inNextFrame = createInNextFrame();

  const animationFrameChecker = createAnimationFrameChecker<HTMLElement>((items, measurements, next): void => {
    const callbacks: CheckerUpdateCallback[] = [];

    items.forEach((value: CheckerItem<HTMLElement>) => {
      // Measure the the element bounding box now
      const rawBoundingBox = measureUsingBoundingClientRect(value.element);

      // And apply per-item transformation if needed
      const boundingBox = value.transform ? value.transform(rawBoundingBox) : rawBoundingBox;

      // And compare to its previous bounding box
      const previousBoundingBox = measurements.get(value.element);
      if (areBoundingBoxesEqual(boundingBox, previousBoundingBox)) return;

      // And only if they are different update the element bounding box in the map
      measurements.set(value.element, boundingBox);

      // Finally add the corresponding onChange callback to the result array
      // to be executed in the next animation frame
      // in order not to mix read/write operations on elements
      callbacks.push((): void => value.onChange(boundingBox));
    });

    if (!callbacks.length) return next();

    inNextFrame(() => {
      callbacks.forEach(callback => callback());
      next();
    });
  });

  const clearAnimationFrameChecker = animationFrameChecker.clear;

  return Object.assign(animationFrameChecker, {
    clear: () => {
      inNextFrame.cancel();
      clearAnimationFrameChecker();
    },
  });
};
