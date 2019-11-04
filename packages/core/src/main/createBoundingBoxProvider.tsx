import React from 'react';
import { discardPosition } from '../utils/discardPosition';
import { CheckerImplementation, BoundingBoxProviderOwnProps, BoundingBoxProviderWrappedComponentProps } from '../types';
import { createUseBoundingBox } from './createUseBoundingBox';
import { renderChildren } from '../utils/renderChildren';
import { discardSize } from '../utils/discardSize';

export function createBoundingBoxProvider<P extends BoundingBoxProviderWrappedComponentProps, C = React.Component<P>>(
  WrappedComponent: string | React.JSXElementConstructor<P>,
  checker: CheckerImplementation<C>,
): React.ComponentType<P & BoundingBoxProviderOwnProps> {
  const useBoundingBox = createUseBoundingBox(checker);

  const BoundingBoxProvider: React.FC<P & BoundingBoxProviderOwnProps> = ({
    boundingBoxTransforms = [],
    children,
    onBoundingBoxChange,
    positionOnly = false,
    sizeOnly = false,
    ...rest
  }) => {
    const ref = React.useRef<C>();
    const boundingBox = useBoundingBox(
      ref,
      onBoundingBoxChange,
      ...boundingBoxTransforms,
      positionOnly ? discardSize : undefined,
      sizeOnly ? discardPosition : undefined,
    );

    const props: P = {
      ...rest,
      children: renderChildren(children, boundingBox),
    } as P;

    return <WrappedComponent {...props} ref={ref} />;
  };

  return BoundingBoxProvider;
}
