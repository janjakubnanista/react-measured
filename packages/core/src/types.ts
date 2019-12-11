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

export type CheckerTransform<T> = (value: T) => BoundingBox;

export type CheckerChangeHandler = (boundingBox: BoundingBox | undefined) => void;

export interface Checker<T> {
  (element: T, onChange: CheckerChangeHandler, transform?: CheckerTransform<BoundingBox>): () => void;
  clear: () => void;
}

export interface CheckerItem<T> {
  element: T;
  transform?: CheckerTransform<BoundingBox>;
  onChange: CheckerChangeHandler;
}
