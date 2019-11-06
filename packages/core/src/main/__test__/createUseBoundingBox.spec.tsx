import React, { createRef } from 'react';
import { act } from 'react-dom/test-utils';
import 'jest';

import { testHook } from '../../test/testHook';
import { buildBoundingBox } from '../../test/builders';
import { createUseBoundingBox } from '../createUseBoundingBox';
import { BoundingBox, CheckerTransformInput } from '../../types';

describe('createUseBoundingBox', () => {
  const defaultBoundingBox: BoundingBox = buildBoundingBox();
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

  it('should return undefined first', () => {
    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(ref);

      expect(boundingBox).toBeUndefined();
    });
  });

  it('should return bounding box when checker calls the registered callback', () => {
    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(ref);
    });

    act(() => {
      const callback = checker.register.mock.calls[0][1];

      callback(defaultBoundingBox);
    });

    expect(boundingBox).toBe(defaultBoundingBox);
  });

  it('should call onChange when checker calls the registered callback', () => {
    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);
    const onChange = jest.fn();
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(ref, onChange);
    });

    act(() => {
      const callback = checker.register.mock.calls[0][1];

      callback(defaultBoundingBox);
    });

    expect(boundingBox).toBe(defaultBoundingBox);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(defaultBoundingBox);
  });

  it('should register a ref on checker when onChange changes', () => {
    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);
    const onChange = jest.fn();
    const newOnChange = jest.fn();

    const unregister = jest.fn();
    checker.register.mockReturnValueOnce(unregister);

    // First we render with the old onChange
    const component = testHook(onChangeProp => {
      useBoundingBox(ref, onChangeProp);
    }, onChange);

    // Then we update the value
    component.setProps({ testProp: newOnChange });

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(checker.register).toHaveBeenCalledTimes(2);
    expect(checker.register).toHaveBeenCalledWith(ref, expect.any(Function));

    act(() => {
      const callback = checker.register.mock.calls[1][1];

      callback(defaultBoundingBox);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(newOnChange).toHaveBeenCalledTimes(1);
    expect(newOnChange).toHaveBeenCalledWith(defaultBoundingBox);
  });

  it('should register a ref on checker when transforms change', () => {
    const identity = (value: BoundingBox): BoundingBox => value;

    const checker = mockChecker();
    const useBoundingBox = createUseBoundingBox(checker);
    const onChange = jest.fn();
    const transforms: CheckerTransformInput[] = [identity];
    const newTransforms: CheckerTransformInput[] = [identity, identity];

    const unregister = jest.fn();
    checker.register.mockReturnValueOnce(unregister);

    // First we render with the old onChange
    const component = testHook(transformsProp => {
      useBoundingBox(ref, onChange, transformsProp);
    }, transforms);

    // Then we update the value
    component.setProps({ testProp: newTransforms });

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(checker.register).toHaveBeenCalledTimes(2);
    expect(checker.register).toHaveBeenCalledWith(ref, expect.any(Function), ...transforms);
    expect(checker.register).toHaveBeenCalledWith(ref, expect.any(Function), ...newTransforms);

    act(() => {
      const callback = checker.register.mock.calls[1][1];

      callback(defaultBoundingBox);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange with undefined when unmounted', () => {
    const checker = mockChecker();
    const onChange = jest.fn();
    const useBoundingBox = createUseBoundingBox(checker);

    const unregister = jest.fn();
    checker.register.mockReturnValueOnce(unregister);

    const component = testHook(() => {
      useBoundingBox(ref, onChange);
    });

    expect(checker.register).toHaveBeenCalledTimes(1);
    expect(checker.register).toHaveBeenCalledWith(ref, expect.any(Function));

    component.unmount();

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
