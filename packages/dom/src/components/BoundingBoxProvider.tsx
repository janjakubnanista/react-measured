import React from 'react';
import { BoundingBoxProviderOwnProps, createBoundingBoxProvider } from 'react-measured';
import { HTMLProps } from 'react';
import { transformBoundingBoxToDocument } from '../utils/transformBoundingBoxToDocument';
import { checker } from '../checker';

export type BoundingBoxOrigin = 'document' | 'viewport';

export interface DOMBoundingBoxProviderOwnProps extends BoundingBoxProviderOwnProps {
  origin?: BoundingBoxOrigin;
}

export type BoundingBoxProviderProps = DOMBoundingBoxProviderOwnProps & HTMLProps<HTMLDivElement>;

export const BoundingBoxProviderComponent = createBoundingBoxProvider<HTMLProps<HTMLDivElement>, HTMLDivElement>(
  'div',
  checker,
);

export const BoundingBoxProvider: React.FC<BoundingBoxProviderProps> = ({ origin = 'viewport', ...props }) => {
  const transforms = origin === 'document' ? [transformBoundingBoxToDocument] : [];

  return <BoundingBoxProviderComponent boundingBoxTransforms={transforms} {...props} />;
};
