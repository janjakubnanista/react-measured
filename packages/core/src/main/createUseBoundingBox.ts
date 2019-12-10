import { useState, useEffect } from 'react';
import { BoundingBox, Checker, CheckerChangeHandler, CheckerTransform } from '../types';

const noop = (): void => undefined;

export type UseBoundingBox<T> = (
  ref: React.RefObject<T | null | undefined>,
  onChange?: CheckerChangeHandler,
  transform?: CheckerTransform<BoundingBox>,
) => BoundingBox | undefined;

export const createUseBoundingBox = <T>(checker: Checker<T>): UseBoundingBox<T> => {
  return (ref, onChange = noop, transform): BoundingBox | undefined => {
    const [boundingBox, setBoundingBox] = useState<BoundingBox>();

    useEffect(() => {
      if (!ref.current) return;

      return checker(
        ref.current,
        (newBoundingBox: BoundingBox): void => {
          setBoundingBox(newBoundingBox);

          onChange && onChange(newBoundingBox);
        },
        transform,
      );
    }, [ref.current, onChange, transform]);

    useEffect(() => {
      return (): void => onChange && onChange(undefined);
    }, []);

    return boundingBox;
  };
};
