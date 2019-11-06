import { useState, useEffect } from 'react';
import { BoundingBox, Checker, CheckerRef, CheckerChangeHandler, CheckerTransformInput } from '../types';

const noop = () => undefined;

const NO_TRANSFORMS: CheckerTransformInput[] = [];

export type UseBoundingBox<T> = (
  ref: CheckerRef<T>,
  onChange?: CheckerChangeHandler,
  transforms?: CheckerTransformInput[],
) => BoundingBox | undefined;

export const createUseBoundingBox = <T>(checker: Checker<T>): UseBoundingBox<T> => {
  return (ref, onChange = noop, transforms = NO_TRANSFORMS): BoundingBox | undefined => {
    const [boundingBox, setBoundingBox] = useState<BoundingBox>();

    useEffect(() => {
      const callback = (newBoundingBox: BoundingBox): void => {
        setBoundingBox(newBoundingBox);

        onChange && onChange(newBoundingBox);
      };

      return checker.register(ref, callback, ...transforms);
    }, [ref, onChange, transforms]);

    useEffect(() => {
      return (): void => onChange && onChange(undefined);
    }, []);

    return boundingBox;
  };
};
