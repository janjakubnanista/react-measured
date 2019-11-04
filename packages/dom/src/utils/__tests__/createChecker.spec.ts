import 'jest';
import { createChecker } from '../createChecker';
import { BoundingBox, identity } from '@react-width-height/core';
import { createRef, MutableRefObject } from 'react';
import { CheckerTransform, CheckerImplementation } from '@react-width-height/core';

const mockRequestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');

const nextFrame = (): void => {
  expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);

  const callback: FrameRequestCallback = mockRequestAnimationFrame.mock.calls[0][0];
  expect(callback).toBeInstanceOf(Function);

  mockRequestAnimationFrame.mockClear();
  callback(0);
};

const nextTwoFrames = (): void => {
  nextFrame();
  nextFrame();
};

const createRefWith = (element: HTMLElement | undefined): MutableRefObject<HTMLElement | undefined> => {
  const ref = createRef() as MutableRefObject<HTMLElement | undefined>;

  ref.current = element;

  return ref;
};

const createElement = (): HTMLElement => document.createElement('div');

const identityTransform: CheckerTransform<BoundingBox> = identity;
const shiftBoundingBox: CheckerTransform<BoundingBox> = boundingBox => ({
  ...boundingBox,
  top: boundingBox.top + 5,
  right: boundingBox.right + 5,
});

describe('createChecker', () => {
  const zeroBoundingBox: BoundingBox = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  const element: HTMLElement = createElement();
  const anotherElement: HTMLElement = createElement();

  let defaultMeasure: jest.Mock;
  let checker: CheckerImplementation<HTMLElement>;
  let defaultOnChange: jest.Mock;

  beforeEach(() => {
    defaultOnChange = jest.fn();
    defaultMeasure = jest.fn(() => zeroBoundingBox);
    checker = createChecker(defaultMeasure);

    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();
  });

  afterEach(() => {
    checker.clear();
  });

  it('should start checking when a new element is registered', () => {
    checker.register(createRef(), defaultOnChange);

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should measure in one frame and call onChange in another to prevent layout thrashing', () => {
    checker.register(createRefWith(element), defaultOnChange);

    // In the first frame only read operations are performed on the DOM
    nextFrame();
    expect(defaultMeasure).toHaveBeenCalledTimes(1);
    expect(defaultMeasure).toHaveBeenCalledWith(element);
    expect(defaultOnChange).not.toHaveBeenCalled();

    defaultMeasure.mockClear();

    nextFrame();
    expect(defaultMeasure).not.toHaveBeenCalled();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);
  });

  it('should group measurements and onChange calls to prevent layout thrashing', () => {
    const ref1 = createRefWith(element);
    const ref2 = createRefWith(anotherElement);
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checker.register(ref1, onChange1);
    checker.register(ref2, onChange2);

    nextFrame();
    expect(defaultMeasure).toHaveBeenCalledTimes(2);
    expect(defaultMeasure).toHaveBeenCalledWith(element);
    expect(defaultMeasure).toHaveBeenCalledWith(anotherElement);
    expect(onChange1).not.toHaveBeenCalled();
    expect(onChange2).not.toHaveBeenCalled();

    defaultMeasure.mockClear();

    nextFrame();
    expect(defaultMeasure).not.toHaveBeenCalled();
    expect(onChange1).toHaveBeenCalledTimes(1);
    expect(onChange2).toHaveBeenCalledWith(zeroBoundingBox);
  });

  it('should call onChange when registered ref was populated', () => {
    const ref = createRefWith(undefined);
    checker.register(ref, defaultOnChange);

    nextTwoFrames();
    expect(defaultOnChange).not.toHaveBeenCalled();

    ref.current = element;

    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);
  });

  it('should not call onChange when the registered ref was emptied', () => {
    const ref = createRefWith(undefined);
    checker.register(ref, defaultOnChange);

    ref.current = element;
    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);

    defaultOnChange.mockClear();
    ref.current = undefined;
    nextTwoFrames();
    expect(defaultOnChange).not.toHaveBeenCalled();
  });

  it('should stop checking after the last ref was unregistered', () => {
    const ref = createRefWith(undefined);
    const unregister = checker.register(ref, defaultOnChange);

    nextTwoFrames();
    expect(mockCancelAnimationFrame).not.toHaveBeenCalled();

    unregister();
    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);

    // Now this is just for extra safety
    //
    // Under normal circumstances calling cancelAnimationFrame would prevent
    // the next frame callback from executing. Since this callback was registered
    // we might as well execute it and see that if it did run it would not register
    // another frame
    nextFrame();
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should call onChange when dimensions change', () => {
    const ref = createRefWith(undefined);
    checker.register(ref, defaultOnChange);

    ref.current = element;
    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);

    defaultOnChange.mockClear();
    defaultMeasure.mockImplementationOnce(() => shiftBoundingBox(zeroBoundingBox));

    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));
  });

  it('should call onChange when transform return value changes', () => {
    const transform = jest.fn(identityTransform);
    const ref = createRefWith(undefined);
    checker.register(ref, defaultOnChange, transform);

    ref.current = element;
    nextTwoFrames();
    expect(transform).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);

    // Now let's run the checks couple times with onChange cleared
    defaultOnChange.mockClear();

    nextTwoFrames();
    expect(transform).toHaveBeenCalledTimes(2);
    expect(defaultOnChange).not.toHaveBeenCalled();

    nextTwoFrames();
    expect(transform).toHaveBeenCalledTimes(3);
    expect(defaultOnChange).not.toHaveBeenCalled();

    transform.mockImplementation(shiftBoundingBox);
    nextTwoFrames();
    expect(transform).toHaveBeenCalledTimes(4);
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));
  });

  describe('when multiple elements are registered', () => {
    const ref1 = createRefWith(element);
    const ref2 = createRefWith(anotherElement);
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    beforeEach(() => {
      onChange1.mockReset();
      onChange2.mockReset();
    });

    it('should call onChange after a ref was reregistered', () => {
      checker.register(ref1, onChange1);
      const unregister = checker.register(ref2, onChange2, shiftBoundingBox);

      nextTwoFrames();
      expect(onChange1).toHaveBeenCalledTimes(1);
      expect(onChange1).toHaveBeenCalledWith(zeroBoundingBox);
      expect(onChange2).toHaveBeenCalledTimes(1);
      expect(onChange2).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));

      onChange1.mockClear();
      onChange2.mockClear();

      unregister();
      nextTwoFrames();

      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).not.toHaveBeenCalled();

      checker.register(ref2, onChange2, shiftBoundingBox);

      nextTwoFrames();
      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).toHaveBeenCalledTimes(1);
      expect(onChange2).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));
    });
  });

  describe('when stop is called', () => {
    it.todo('should stop checking all registered refs');

    it.todo('should not call onChange after start was called and bounding box did not change');

    it.todo('should call onChange after start was called and bounding box changed');
  });

  describe('when clear is called', () => {
    it.todo('should stop checking all registered refs');

    it.todo('should call onChange after a ref was reregistered and bounding box did not change');

    it.todo('should call onChange after a ref was reregistered and bounding box changed');
  });
});
