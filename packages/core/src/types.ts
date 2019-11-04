import React, { PropsWithChildren, ReactNode } from 'react';

export interface Position {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

export type BoundingBox = Position & Size;

export type BoundingBoxProviderChildrenFunction = (props: BoundingBox) => React.ReactNode;

export interface BoundingBoxProviderOwnProps {
  boundingBoxTransforms?: CheckerTransformInput[];
  children?: BoundingBoxProviderChildrenFunction | React.ReactNode;
  onBoundingBoxChange?: (props: BoundingBox | undefined) => void;
  positionOnly?: boolean;
  sizeOnly?: boolean;
}

export type BoundingBoxProviderWrappedComponentProps = PropsWithChildren<{}>;

export type BoundingBoxProviderProps<P extends PropsWithChildren<{}>> = BoundingBoxProviderOwnProps &
  Omit<P, keyof BoundingBoxProviderOwnProps>;

// Checker types
export type CheckerRef<T> = React.RefObject<T | undefined | null>;

export type CheckerTransform<T> = (value: T) => BoundingBox;

export type CheckerUnregisterCallback = () => void;

export type CheckerChangeHandler = (boundingBox: BoundingBox | undefined) => void;

export interface CheckerItem<T> {
  ref: CheckerRef<T>;
  transforms: CheckerTransform<BoundingBox>[];
  onChange: CheckerChangeHandler;
}

export interface CheckerImplementation<T> {
  register: (
    ref: CheckerRef<T>,
    onChange: CheckerChangeHandler,
    ...transforms: CheckerTransformInput[]
  ) => CheckerUnregisterCallback;
  start: () => void;
  stop: () => void;
  clear: () => void;
}

export type CheckerTransformInput = CheckerTransform<BoundingBox> | null | false | undefined;

// Hook types
export type UseBoundingBox<T> = (
  ref: CheckerRef<T>,
  onChange?: CheckerChangeHandler,
  ...transforms: CheckerTransformInput[]
) => BoundingBox | undefined;
