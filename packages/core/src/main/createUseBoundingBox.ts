import { useState, useEffect } from 'react';
import { BoundingBox, CheckerImplementation, UseBoundingBox } from '../types';
import { noop } from '../utils/noop';

export const createUseBoundingBox = <T>(checker: CheckerImplementation<T>): UseBoundingBox<T> => {
  return (ref, onChange = noop, ...transforms): BoundingBox | undefined => {
    const [boundingBox, setBoundingBox] = useState<BoundingBox>();

    useEffect(() => {
      const callback = (newBoundingBox: BoundingBox): void => {
        setBoundingBox(newBoundingBox);
        onChange(newBoundingBox);
      };

      return checker.register(ref, callback, ...transforms);
    }, [ref, onChange, ...transforms]);

    useEffect(() => {
      return (): void => onChange(undefined);
    }, []);

    return boundingBox;
  };
};
