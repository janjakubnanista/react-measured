import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { BoundingBoxProvider } from '../../src';
import { Rotate, RelativePosition, AbsolutePosition } from './position';
import { BoundingBox } from 'react-measured';

export interface BubbleProps {
  color?: string;
  pointAt?: BoundingBox;
}

export const Bubble: React.FC<BubbleProps> = ({ children, color = '#fc0', pointAt }) => {
  return (
    <BoundingBoxProvider>
      {({ top, left, width, height }: BoundingBox): ReactNode => {
        const a = pointAt ? pointAt.left + pointAt.width / 2 - left - width / 2 : 0;
        const b = pointAt ? pointAt.top + pointAt.height / 2 - top - height / 2 : 0;
        const angle = Math.atan2(a, -b);

        // return <Rotate angle={angle}>
        //   <BubbleShape style={{ borderColor: color }}/>
        // </Rotate>;

        return (
          <RelativePosition left={0} top={0}>
            <Rotate angle={angle}>
              <BubbleShape style={{ borderColor: color }} />
            </Rotate>

            {children && (
              <AbsolutePosition
                top="0"
                left="0"
                bottom="0"
                right="0"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                {children}
              </AbsolutePosition>
            )}
          </RelativePosition>
        );
      }}
    </BoundingBoxProvider>
  );
};

export const BubbleShape = styled.div`
  position: relative;
  border: 50px solid #fc0;
  border-radius: 9999px;

  &:after {
    display: block;
    content: '';
    position: absolute;
    left: -40px;
    top: -120px;
    border: 30px solid transparent;
    border-width: 40px;
    border-bottom-width: 50px;
    border-bottom-color: inherit;
  }
`;
