import React from 'react';

export interface BoundingBox {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

export type BoundingBoxProviderChildrenFunction = (props: BoundingBox) => React.ReactNode;

// Checker types
export type CheckerRef<T> = React.RefObject<T | undefined | null>;

export type CheckerTransform<T> = (value: T) => BoundingBox;

export type CheckerChangeHandler = (boundingBox: BoundingBox | undefined) => void;

export interface Checker<T> {
  register: (ref: CheckerRef<T>, onChange: CheckerChangeHandler, ...transforms: CheckerTransformInput[]) => () => void;
  start: () => void;
  stop: () => void;
  clear: () => void;
}

export type CheckerTransformInput = CheckerTransform<BoundingBox> | null | false | undefined;
