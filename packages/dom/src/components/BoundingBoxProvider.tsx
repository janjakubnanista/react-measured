// import React from 'react';
// import { BoundingBoxProviderProps, createBoundingBoxProviderHOC } from 'react-measured';
// import { HTMLProps } from 'react';
// import { transformBoundingBoxToDocument } from '../utils/transformBoundingBoxToDocument';
// import { useBoundingBox } from '../main/useBoundingBox';

// export type BoundingBoxOrigin = 'document' | 'viewport';

// export type DOMBoundingBoxProviderProps<P> = BoundingBoxProviderProps<P> & {
//   origin?: BoundingBoxOrigin;
// };

// export const createBoundingBoxProvider = createBoundingBoxProviderHOC<HTMLProps<HTMLElement>, HTMLElement>(
//   useBoundingBox,
// );

// export function BoundingBoxProvider<P extends {}>({
//   origin = 'viewport',
//   ...props
// }: DOMBoundingBoxProviderProps<P>): React.ReactElement {
//   const transforms = origin === 'document' ? [transformBoundingBoxToDocument] : [];

//   return <BoundingBoxProviderComponent boundingBoxTransforms={transforms} {...props} />;
// }
