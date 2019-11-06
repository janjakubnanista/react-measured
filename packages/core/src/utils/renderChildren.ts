import React from 'react';
import { BoundingBoxProviderChildrenFunction, BoundingBox } from '../types';

const isBoundingBoxProviderChildrenFunction = (
  children: BoundingBoxProviderChildrenFunction | React.ReactNode,
): children is BoundingBoxProviderChildrenFunction => typeof children === 'function';

export const renderChildren = (
  children: BoundingBoxProviderChildrenFunction | React.ReactNode,
  boundingBox: BoundingBox | undefined,
): React.ReactNode => {
  if (!isBoundingBoxProviderChildrenFunction(children)) {
    return children;
  }

  if (!boundingBox) return null;

  return children(boundingBox);
};
