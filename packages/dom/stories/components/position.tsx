import React from 'react';
import styled from 'styled-components';

export interface RotateProps {
  angle: number;
}

export const Rotate: React.FC<RotateProps> = ({ angle, children }) => (
  <div style={{ transform: `rotate(${angle}rad)` }}>{children}</div>
);

export interface PositionProps extends React.HTMLProps<HTMLDivElement> {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
}

export const FixedPosition: React.FC<PositionProps> = ({ top, right, bottom, left, style, ...rest }) => (
  <div style={{ ...style, position: 'fixed', top, right, bottom, left }} {...rest} />
);

export const AbsolutePosition: React.FC<PositionProps> = ({ top, right, bottom, left, style, ...rest }) => (
  <div style={{ ...style, position: 'absolute', top, right, bottom, left }} {...rest} />
);

export const RelativePosition: React.FC<PositionProps> = ({ top, right, bottom, left, style, ...rest }) => (
  <div style={{ ...style, position: 'relative', top, right, bottom, left }} {...rest} />
);
