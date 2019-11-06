import React from 'react';
import { createMeasured, lazyValue, MeasuredComponentType } from 'react-measured';
import { useBoundingBox } from '../main/useBoundingBox';
import { htmlTags, HTMLTag } from '../utils/htmlTags';

type HTMLMeasuredFunction = ReturnType<typeof createMeasured>;

type HTMLMeasured = HTMLMeasuredFunction &
  {
    [T in HTMLTag]: MeasuredComponentType<React.ComponentProps<T>>;
  };

const Measured: HTMLMeasured = createMeasured<HTMLElement>(useBoundingBox) as HTMLMeasured;

htmlTags.forEach(<T extends HTMLTag>(htmlTag: T) => {
  Object.defineProperty(Measured, htmlTag, {
    get: lazyValue(() => Measured(htmlTag)),
  });
});

export { Measured };
