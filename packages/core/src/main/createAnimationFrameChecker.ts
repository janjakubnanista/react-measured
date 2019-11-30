import { CheckerTransform, CheckerChangeHandler, BoundingBox, CheckerItem, Checker } from '../types';
import { InNextFrame, createInNextFrame } from './createInNextFrame';

export const createAnimationFrameChecker = <T>(
  check: (items: Set<CheckerItem<T>>, measurements: Map<T, BoundingBox>, next: () => void) => void,
): Checker<T> => {
  const items: Set<CheckerItem<T>> = new Set();
  const measurements: Map<T, BoundingBox> = new Map();
  const inNextFrame: InNextFrame = createInNextFrame();

  const addItem = (item: CheckerItem<T>): CheckerItem<T> => {
    items.add(item);

    return item;
  };

  const removeItem = (item: CheckerItem<T>): void => {
    items.delete(item);
    measurements.delete(item.element);
  };

  const loop = (): void => {
    if (items.size === 0) return;

    inNextFrame(() => {
      check(items, measurements, () => loop());
    });
  };

  const clear = (): void => {
    items.clear();
    measurements.clear();
    inNextFrame.cancel();
  };

  const add = (element: T, onChange: CheckerChangeHandler, transform?: CheckerTransform<BoundingBox>): (() => void) => {
    const item = addItem({ element, transform, onChange });
    loop();

    return (): void => removeItem(item);
  };

  return Object.assign(add, { clear });
};
