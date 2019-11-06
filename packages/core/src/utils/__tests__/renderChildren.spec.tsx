import React from 'react';
import 'jest';
import { renderChildren } from '../renderChildren';
import { buildBoundingBox } from '../../test/builders';

describe('renderChildren', () => {
  const defaultBoundingBox = buildBoundingBox();

  const testReactNode = (value: React.ReactNode): void => {
    expect(renderChildren(value, undefined)).toBe(value);
    expect(renderChildren(value, defaultBoundingBox)).toBe(value);
  };

  it('should return undefined when passed undefined', () => {
    testReactNode(undefined);
  });

  it('should return null when passed null', () => {
    testReactNode(null);
  });

  it('should return false when passed false', () => {
    testReactNode(false);
  });

  it('should return true when passed true', () => {
    testReactNode(true);
  });

  it('should return a string when passed string', () => {
    testReactNode('heyyyyyy');
  });

  it('should return a ReactElement when passed ReactElement', () => {
    testReactNode(<div />);
  });

  it('should return null when passed a function and boundingBox is undefined', () => {
    const render = jest.fn().mockReturnValue(<div />);

    expect(renderChildren(render, undefined)).toBe(null);
  });

  it('should return the function return value when passed a function and boundingBox is defined', () => {
    const value = <div />;
    const render = jest.fn().mockReturnValue(value);

    expect(renderChildren(render, defaultBoundingBox)).toBe(value);
  });
});
