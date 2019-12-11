import 'jest';
import { createHTMLChecker } from '../createHTMLChecker';
import { BoundingBox } from 'react-measured';
import { CheckerTransform, Checker } from 'react-measured';

const identity = <A>(value: A): A => value;

const zeroBoundingBox: BoundingBox = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
};

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

const createElement = (): HTMLElement => {
  const element = document.createElement('div');
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(zeroBoundingBox as DOMRect);

  return element;
};

const identityTransform: CheckerTransform<BoundingBox> = identity;
const shiftBoundingBox: CheckerTransform<BoundingBox> = boundingBox => ({
  ...boundingBox,
  top: boundingBox.top + 5,
  right: boundingBox.right + 5,
});

describe('createHTMLChecker', () => {
  let element: HTMLElement;
  let anotherElement: HTMLElement;

  let checker: Checker<HTMLElement>;
  let defaultOnChange: jest.Mock;

  beforeEach(() => {
    element = createElement();
    anotherElement = createElement();

    defaultOnChange = jest.fn();
    checker = createHTMLChecker();

    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();
  });

  afterEach(() => {
    checker.clear();
  });

  it('should request an animation frame when called', () => {
    checker(element, defaultOnChange);

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should measure in one frame and call onChange in another to prevent layout thrashing', () => {
    checker(element, defaultOnChange);

    // In the first frame only read operations are performed on the DOM
    nextFrame();
    expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).not.toHaveBeenCalled();

    nextFrame();
    expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);
  });

  it('should group measurements and onChange calls to prevent layout thrashing', () => {
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checker(element, onChange1);
    checker(anotherElement, onChange2);

    nextFrame();
    expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(anotherElement.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(onChange1).not.toHaveBeenCalled();
    expect(onChange2).not.toHaveBeenCalled();

    (element.getBoundingClientRect as jest.Mock).mockClear();
    (anotherElement.getBoundingClientRect as jest.Mock).mockClear();

    nextFrame();
    expect(element.getBoundingClientRect).not.toHaveBeenCalled();
    expect(anotherElement.getBoundingClientRect).not.toHaveBeenCalled();
    expect(onChange1).toHaveBeenCalledTimes(1);
    expect(onChange2).toHaveBeenCalledWith(zeroBoundingBox);
  });

  it('should stop checking after the last element was unregistered', () => {
    const unregister1 = checker(element, defaultOnChange);
    const unregister2 = checker(anotherElement, defaultOnChange);

    nextFrame();
    unregister1();
    nextTwoFrames();

    unregister2();
    nextFrame();
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should call onChange when dimensions change', () => {
    checker(element, defaultOnChange);

    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);

    defaultOnChange.mockClear();
    (element.getBoundingClientRect as jest.Mock).mockImplementation(() => shiftBoundingBox(zeroBoundingBox));

    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));

    defaultOnChange.mockClear();
    nextTwoFrames();
    expect(defaultOnChange).not.toHaveBeenCalled();
  });

  it('should call onChange when transform return value changes', () => {
    const transform = jest.fn(identityTransform);
    checker(element, defaultOnChange, transform);
    nextTwoFrames();
    expect(transform).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(zeroBoundingBox);

    // Now let's run the checks couple times with onChange cleared
    defaultOnChange.mockClear();

    nextTwoFrames();
    expect(defaultOnChange).not.toHaveBeenCalled();

    nextTwoFrames();
    expect(defaultOnChange).not.toHaveBeenCalled();

    transform.mockImplementation(shiftBoundingBox);
    nextTwoFrames();
    expect(defaultOnChange).toHaveBeenCalledTimes(1);
    expect(defaultOnChange).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));

    defaultOnChange.mockClear();
    nextTwoFrames();
    expect(defaultOnChange).not.toHaveBeenCalled();
  });

  describe('when multiple elements are registered', () => {
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    beforeEach(() => {
      onChange1.mockReset();
      onChange2.mockReset();
    });

    it('should call onChange after a ref was reregistered', () => {
      checker(element, onChange1);
      const unregister = checker(anotherElement, onChange2, shiftBoundingBox);

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

      checker(anotherElement, onChange2, shiftBoundingBox);

      nextTwoFrames();
      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).toHaveBeenCalledTimes(1);
      expect(onChange2).toHaveBeenCalledWith(shiftBoundingBox(zeroBoundingBox));
    });

    it('should call onChange on all elements even if they are the same', () => {
      checker(element, onChange1);
      checker(element, onChange2);

      nextTwoFrames();
      expect(onChange1).toHaveBeenCalledTimes(1);
      expect(onChange1).toHaveBeenCalledWith(zeroBoundingBox);
      expect(onChange2).toHaveBeenCalledTimes(1);
      expect(onChange2).toHaveBeenCalledWith(zeroBoundingBox);
    });

    it('should not call onChange when the same elements are registered and dimensions do not change', () => {
      checker(element, onChange1);
      checker(element, onChange2);

      nextTwoFrames();
      expect(onChange1).toHaveBeenCalledTimes(1);
      expect(onChange1).toHaveBeenCalledWith(zeroBoundingBox);
      expect(onChange2).toHaveBeenCalledTimes(1);
      expect(onChange2).toHaveBeenCalledWith(zeroBoundingBox);

      onChange1.mockClear();
      onChange2.mockClear();

      nextTwoFrames();

      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).not.toHaveBeenCalled();
    });
  });
});
