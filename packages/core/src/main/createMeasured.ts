import React, { useCallback } from 'react';
import { discardPosition, discardSize } from '../utils/defaultTransforms';
import { BoundingBox, BoundingBoxProviderChildrenFunction, CheckerTransform } from '../types';
import { UseBoundingBox } from './createUseBoundingBox';
import { renderChildren } from '../utils/renderChildren';

export interface MeasuredProps {
  children?: BoundingBoxProviderChildrenFunction | React.ReactNode;
  positionOnly?: boolean;
  sizeOnly?: boolean;
  onBoundingBoxChange?: (props: BoundingBox | undefined) => void;
}

export type Measured<I> = <T extends MeasurableComponentType<I>>(type: T) => MeasuredComponentType<T>;

// The type of wrapped component is constrained to:
//
// - For HTML elements any HTML tag will do provided the checker supports HTMLElement
// - For Components any component that accepts a supported ref and children will do
export type MeasurableComponentType<I> = I extends HTMLElement
  ? keyof React.ReactHTML | (React.ComponentType<React.RefAttributes<I> & React.PropsWithChildren<{}>>)
  : React.ComponentType<React.RefAttributes<I>>;

export type MeasuredComponentType<T extends keyof React.ReactHTML | React.ComponentType> = React.FC<
  Omit<React.ComponentProps<T>, 'ref'> & MeasuredProps
>;

export function createMeasured<I>(useBoundingBox: UseBoundingBox<I>): Measured<I> {
  function measured<T extends MeasurableComponentType<I>>(type: T): MeasuredComponentType<T> {
    const Measured: MeasuredComponentType<T> = ({
      children,
      onBoundingBoxChange,
      positionOnly = false,
      sizeOnly = false,
      ...rest
    }) => {
      // First let's create a ref to pass to the rendered component
      const ref = React.useRef<I>() as React.RefObject<I>;

      // Then compile a memoised list of transformation functions
      // The transformations are used to discard size or position
      // from the measured BoundingBox to prevent unnecessary renders
      //
      // (when you only need the element size you for sure don't need the component to rerender
      // with every scroll)
      const transform: CheckerTransform<BoundingBox> = useCallback(
        boundingBox => {
          if (sizeOnly) return discardPosition(boundingBox);
          if (positionOnly) return discardSize(boundingBox);

          return boundingBox;
        },
        [sizeOnly, positionOnly],
      );

      // Now let's get the bounding box!
      const boundingBox = useBoundingBox(ref, onBoundingBoxChange, transform);

      // Aaaaaand render
      return React.createElement(type, Object.assign({}, rest, { ref }), renderChildren(children, boundingBox));
    };

    return Measured;
  }

  return measured as Measured<I>;
}
