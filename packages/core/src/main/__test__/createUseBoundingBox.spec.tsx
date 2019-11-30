import React, { createRef, MutableRefObject } from 'react';
import { act } from 'react-dom/test-utils';
import 'jest';

import { testHook } from '../../test/testHook';
import { buildBoundingBox } from '../../test/builders';
import { createUseBoundingBox } from '../createUseBoundingBox';
import { BoundingBox, Checker, CheckerTransform } from '../../types';

describe('createUseBoundingBox', () => {
  const defaultBoundingBox: BoundingBox = buildBoundingBox();
  const createElement = (): HTMLElement => document.createElement('div');
  const createChecker = () => Object.assign(jest.fn(), { clear: jest.fn() });

  const createRefWith = (element: HTMLElement): React.RefObject<HTMLElement> => {
    const ref = createRef() as React.MutableRefObject<HTMLElement>;

    ref.current = element;

    return ref;
  };

  let defaultChecker = createChecker();
  const emptyRef = createRef<HTMLElement>();
  const nonEmptyRef = createRefWith(createElement());

  beforeEach(() => {
    defaultChecker = createChecker();
  });

  it('should not register a ref on checker when ref is empty', () => {
    const useBoundingBox = createUseBoundingBox(defaultChecker);

    testHook(() => {
      useBoundingBox(emptyRef);
    });

    expect(defaultChecker).not.toHaveBeenCalled();
  });

  it('should register a ref on checker when ref is not empty', () => {
    const useBoundingBox = createUseBoundingBox(defaultChecker);

    testHook(() => {
      useBoundingBox(nonEmptyRef);
    });

    expect(defaultChecker).toHaveBeenCalledTimes(1);
    expect(defaultChecker).toHaveBeenCalledWith(nonEmptyRef.current, expect.any(Function), undefined);
  });

  it('should return undefined first', () => {
    const useBoundingBox = createUseBoundingBox(defaultChecker);
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(nonEmptyRef);

      expect(boundingBox).toBeUndefined();
    });
  });

  it('should return bounding box when checker calls the registered callback', () => {
    const useBoundingBox = createUseBoundingBox(defaultChecker);
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(nonEmptyRef);
    });

    act(() => {
      const callback = defaultChecker.mock.calls[0][1];

      callback(defaultBoundingBox);
    });

    expect(boundingBox).toBe(defaultBoundingBox);
  });

  it('should call onChange when checker calls the registered callback', () => {
    const useBoundingBox = createUseBoundingBox(defaultChecker);
    const onChange = jest.fn();
    let boundingBox: BoundingBox | undefined;

    testHook(() => {
      boundingBox = useBoundingBox(nonEmptyRef, onChange);
    });

    act(() => {
      const callback = defaultChecker.mock.calls[0][1];

      callback(defaultBoundingBox);
    });

    expect(boundingBox).toBe(defaultBoundingBox);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(defaultBoundingBox);
  });

  it('should register a ref on checker when onChange changes', () => {
    const useBoundingBox = createUseBoundingBox(defaultChecker);
    const onChange = jest.fn();
    const newOnChange = jest.fn();

    const unregister = jest.fn();
    defaultChecker.mockReturnValueOnce(unregister);

    // First we render with the old onChange
    const component = testHook(onChangeProp => {
      useBoundingBox(nonEmptyRef, onChangeProp);
    }, onChange);

    // Then we update the value
    component.setProps({ testProp: newOnChange });

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(defaultChecker).toHaveBeenCalledTimes(2);
    expect(defaultChecker).toHaveBeenCalledWith(nonEmptyRef.current, expect.any(Function), undefined);

    act(() => {
      const callback = defaultChecker.mock.calls[1][1];

      callback(defaultBoundingBox);
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(newOnChange).toHaveBeenCalledTimes(1);
    expect(newOnChange).toHaveBeenCalledWith(defaultBoundingBox);
  });

  it('should register a ref on checker when transform changes', () => {
    const identity = (value: BoundingBox): BoundingBox => value;

    const useBoundingBox = createUseBoundingBox(defaultChecker);
    const onChange = jest.fn();
    const transform: CheckerTransform<BoundingBox> = identity;
    const newTransform: CheckerTransform<BoundingBox> = identity.bind(null);

    const unregister = jest.fn();
    defaultChecker.mockReturnValueOnce(unregister);

    // First we render with the old onChange
    const component = testHook(transformProp => {
      useBoundingBox(nonEmptyRef, onChange, transformProp);
    }, transform);

    // Then we update the value
    component.setProps({ testProp: newTransform });

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(defaultChecker).toHaveBeenCalledTimes(2);
    expect(defaultChecker).toHaveBeenCalledWith(nonEmptyRef.current, expect.any(Function), transform);
    expect(defaultChecker).toHaveBeenCalledWith(nonEmptyRef.current, expect.any(Function), newTransform);

    act(() => {
      const callback = defaultChecker.mock.calls[1][1];

      callback(defaultBoundingBox);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange with undefined when unmounted', () => {
    const checker = createChecker();
    const onChange = jest.fn();
    const useBoundingBox = createUseBoundingBox(checker);

    const unregister = jest.fn();
    checker.mockReturnValueOnce(unregister);

    const component = testHook(() => {
      useBoundingBox(nonEmptyRef, onChange);
    });

    expect(checker).toHaveBeenCalledTimes(1);
    expect(checker).toHaveBeenCalledWith(nonEmptyRef.current, expect.any(Function), undefined);

    component.unmount();

    expect(unregister).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
