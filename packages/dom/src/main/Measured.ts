import React from 'react';
import { createMeasured, lazyValue, Measured, MeasuredComponentType } from 'react-measured';
import { useBoundingBox } from '../main/useBoundingBox';
import { htmlTags, HTMLTag } from '../utils/htmlTags';

type HTMLMeasured = Measured<HTMLElement> &
  {
    [T in keyof React.ReactHTML]: MeasuredComponentType<React.ComponentProps<T>>;
  };

const Measured: HTMLMeasured = createMeasured<HTMLElement>(useBoundingBox) as HTMLMeasured;

htmlTags.forEach((htmlTag: HTMLTag) => {
  Object.defineProperty(Measured, htmlTag, {
    get: lazyValue(() => Measured(htmlTag)),
  });
});

export { Measured };
