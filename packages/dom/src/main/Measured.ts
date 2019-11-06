import React from 'react';
import { createMeasured, MeasuredComponentType } from 'react-measured';
import { useBoundingBox } from '../main/useBoundingBox';
import { htmlTags, HTMLTag } from '../utils/htmlTags';
import { lazyValue } from '../utils/lazyValue';

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
