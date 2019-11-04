import React, { createRef } from 'react';
import { act } from 'react-dom/test-utils';
import 'jest';

import { testHook } from '../../test/testHook';
import { buildBoundingBox } from '../../test/builders';
import { createUseBoundingBox } from '../createUseBoundingBox';
import { BoundingBox } from '../../types';

describe('createUseBoundingBox', () => {
  const boundingBox: BoundingBox = buildBoundingBox();
  const mockChecker = () => ({
    register: jest.fn().mockImplementation(() => jest.fn()),
    start: jest.fn(),
    stop: jest.fn(),
    clear: jest.fn(),
  });

  let ref: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    ref = createRef<HTMLDivElement>();
  });

  it('should register a ref on checker when mounted', () => {
    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);

    testHook(() => {
      useBoundingBox(ref);
    });

    expect(checker.register).toHaveBeenCalledTimes(1);
    expect(checker.register).toHaveBeenCalledWith(ref, expect.any(Function));
  });

  it('should return undefined first, then bounding box when checker calls the callback', () => {
    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(ref);
    });

    act(() => {
      const callback = checker.register.mock.calls[0][1];

      callback(boundingBox);
    });

    expect(boundingBox).toBe(boundingBox);
  });

  it.todo('should register a ref on checker when ref changes');
  it.todo('should register a ref on checker when onChange changes');
  it.todo('should register a ref on checker when transforms change');
  it.todo('should call onChange with undefined when unmounted');
  it.todo('should return new bounding box when checker calls the callback');
  it.todo('should call onChange with new bounding box when checker calls the callback');
});
