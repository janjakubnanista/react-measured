import React, { useMemo } from 'react';
import { discardPosition, discardSize } from '../utils/defaultTransforms';
import { BoundingBox, BoundingBoxProviderChildrenFunction, CheckerTransformInput } from '../types';
import { UseBoundingBox } from './createUseBoundingBox';
import { renderChildren } from '../utils/renderChildren';

export type MeasuredProps = {
  children?: BoundingBoxProviderChildrenFunction | React.ReactNode;
  positionOnly?: boolean;
  sizeOnly?: boolean;
  onBoundingBoxChange?: (props: BoundingBox | undefined) => void;
};

// The wrapped element must have a ref pointing to a type that matches
// the useBoundingBox and must have a children prop
//
// TODO In some cases you don't need to support children,
// you just want to know a bounding box of some element somewhere
// without it needing to have children
export type MeasurableComponentProps<T, P extends {} = {}> = Omit<React.PropsWithChildren<P>, 'ref'> &
  React.RefAttributes<T>;

// The ComponentType of the returned component
export type MeasuredComponentType<P extends {}> = React.FC<Omit<P, 'ref'> & MeasuredProps>;

// The type of mesured HOC creator for generic components
interface MeasuredComponent<I> {
  <T extends React.ComponentType<P>, P extends MeasurableComponentProps<I, {}>>(type: T): MeasuredComponentType<
    React.ComponentProps<T>
  >;
}

// The type of mesured HOC creator for HTML elements
interface MeasuredHTML<I extends HTMLElement> extends MeasuredComponent<I> {
  <T extends keyof React.ReactHTML, P extends React.ComponentProps<T>>(type: T): MeasuredComponentType<P>;
}

export type Measured<I> = I extends HTMLElement ? MeasuredHTML<I> : MeasuredComponent<I>;

export function createMeasured<I>(useBoundingBox: UseBoundingBox<I>): Measured<I> {
  // To make this work nicely with inferred types we need some overloads here
  //
  // The first overload is for HTML tag names as components,
  // i.e. to make something like
  //
  // createMeasured(useBoundingBox)('div')
  //
  // Return a Component with correct HTML props
  function measured<T extends keyof React.ReactHTML, P extends React.ComponentProps<T>>(
    type: T,
  ): MeasuredComponentType<P>;

  // The second overload is for general component types, i.e.
  //
  // createMeasured(useBoundingBox)(MyComponent)
  function measured<T extends React.ComponentType<P>, P extends MeasurableComponentProps<I, {}>>(
    type: T,
  ): MeasuredComponentType<React.ComponentProps<T>>;

  // Now the actual function definition
  function measured<
    T extends keyof React.ReactHTML | React.ComponentType<P>,
    P extends MeasurableComponentProps<I, {}>
  >(type: T): MeasuredComponentType<P> {
    // const measured: Measured<I> = (
    //   type: T,
    // ): MeasuredComponentType<P> => {
    // This is the created Measured HOC
    const Measured: MeasuredComponentType<P> = ({
      children,
      onBoundingBoxChange,
      positionOnly = false,
      sizeOnly = false,
      ...rest
    }) => {
      // First let's create a ref to pass to the rendered component
      const ref = React.useRef<I>();

      // Then compile a memoised list of transformation functions
      // The transformations are used to discard size or position
      // from the measured BoundingBox to prevent unnecessary renders
      //
      // (when you only need the element size you for sure don't need the component to rerender
      // with every scroll)
      const transforms: CheckerTransformInput[] = useMemo(
        () => [positionOnly && discardSize, sizeOnly && discardPosition],
        [discardSize, discardPosition],
      );

      // Now let's get the bounding box!
      const boundingBox = useBoundingBox(ref, onBoundingBoxChange, transforms);

      // Prepare the props
      const props: P = {
        ...rest,
        ref,
      } as P;

      // Aaaaaand render
      return React.createElement(type, props, renderChildren(children, boundingBox));
    };

    return Measured;
  }

  return measured as Measured<I>;
}
