import { createMeasured, lazyValue, Measured, MeasuredComponentType } from 'react-measured';
import { useBoundingBox } from '../main/useBoundingBox';
import { Measurable, MeasurableComponentName, components } from '../utils/components';

export type NativeMeasuredType<T> = T extends React.ComponentType<infer P>
  ? MeasuredComponentType<React.ComponentType<P>>
  : never;

export type NativeMeasured = (<T extends Measurable>(type: T) => NativeMeasuredType<T>) &
  {
    [T in MeasurableComponentName]: NativeMeasuredType<typeof components[T]>;
  };

const Measured: NativeMeasured = createMeasured(useBoundingBox) as NativeMeasured;

Object.keys(components).forEach((componentName: MeasurableComponentName) => {
  Object.defineProperty(Measured, componentName, {
    get: lazyValue(() => Measured(components[componentName])),
  });
});

export { Measured };
