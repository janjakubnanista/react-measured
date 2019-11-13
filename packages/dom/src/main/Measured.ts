import { createMeasured, lazyValue, Measured, MeasuredComponentType } from 'react-measured';
import { useBoundingBox } from '../main/useBoundingBox';
import { htmlTags, HTMLTag } from '../utils/htmlTags';

type HTMLMeasured = Measured<HTMLElement> &
  {
    [T in HTMLTag]: MeasuredComponentType<T>;
  };

const Measured: HTMLMeasured = createMeasured<HTMLElement>(useBoundingBox) as HTMLMeasured;

htmlTags.forEach((htmlTag: HTMLTag) => {
  Object.defineProperty(Measured, htmlTag, {
    get: lazyValue(() => Measured(htmlTag)),
  });
});

export { Measured };
