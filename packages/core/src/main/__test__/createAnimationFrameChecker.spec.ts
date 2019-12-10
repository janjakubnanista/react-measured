import 'jest';
import { createAnimationFrameChecker } from '../createAnimationFrameChecker';
import { BoundingBox, Checker, CheckerItem } from '../../types';
import { buildBoundingBox } from '../../test/builders';

const defaultBoundingBox = buildBoundingBox();

const mockRequestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');

const nextFrame = (): void => {
  expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);

  const callback: FrameRequestCallback = mockRequestAnimationFrame.mock.calls[0][0];
  expect(callback).toBeInstanceOf(Function);

  mockRequestAnimationFrame.mockClear();
  callback(0);
};

const createElement = (): HTMLElement => document.createElement('div');

describe('createAnimationFrameChecker', () => {
  let check: jest.Mock<void, [Set<CheckerItem<HTMLElement>>, Map<CheckerItem<HTMLElement>, BoundingBox>, () => void]>;
  let checker: Checker<HTMLElement>;
  let defaultOnChange: jest.Mock;

  beforeEach(() => {
    defaultOnChange = jest.fn();
    check = jest.fn();
    checker = createAnimationFrameChecker<HTMLElement>(check);

    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();
  });

  afterEach(() => {
    check.mockReset();
    checker.clear();
  });

  it('should request an animation frame when called', () => {
    checker(createElement(), defaultOnChange);

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should call check() in the next animation frame when called', () => {
    checker(createElement(), defaultOnChange);

    expect(check).not.toHaveBeenCalled();
    nextFrame();
    expect(check).toHaveBeenCalledTimes(1);
    expect(check).toHaveBeenCalledWith(expect.any(Set), expect.any(Map), expect.any(Function));
  });

  it('should call check() with one item and no measurements when called', () => {
    const element = createElement();
    checker(element, defaultOnChange);

    check.mockImplementation((items, measurements, next: () => void) => next());
    nextFrame();
    expect(check).toHaveBeenCalledWith(
      new Set([
        {
          element,
          onChange: defaultOnChange,
          transform: undefined,
        },
      ]),
      new Map(),
      expect.any(Function),
    );
  });

  it('should only request one animation frame when called multiple times before the next frame', () => {
    checker(createElement(), defaultOnChange);
    checker(createElement(), defaultOnChange);
    checker(createElement(), defaultOnChange);

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should only call check() once in the next animation frame when register() is called multiple times', () => {
    checker(createElement(), defaultOnChange);
    checker(createElement(), defaultOnChange);
    checker(createElement(), defaultOnChange);

    expect(check).not.toHaveBeenCalled();
    nextFrame();
    expect(check).toHaveBeenCalledTimes(1);
  });

  it('should call check() once with all items and no measurements when called', () => {
    const element1 = createElement();
    const onChange1 = jest.fn();
    const transform1 = jest.fn();
    checker(element1, onChange1, transform1);
    const element2 = createElement();
    const onChange2 = jest.fn();
    checker(element2, onChange2);
    const element3 = createElement();
    const onChange3 = jest.fn();
    const transform3 = jest.fn();
    checker(element3, onChange3, transform3);

    check.mockImplementation((items, measurements, next: () => void) => next());
    nextFrame();
    expect(check).toHaveBeenCalledWith(
      new Set([
        {
          element: element1,
          onChange: onChange1,
          transform: transform1,
        },
        {
          element: element1,
          onChange: onChange2,
          transform: undefined,
        },
        {
          element: element1,
          onChange: onChange3,
          transform: transform3,
        },
      ]),
      new Map(),
      expect.any(Function),
    );
  });

  it('should keep measurements between check() calls', () => {
    const element1 = createElement();
    const element2 = createElement();
    const boundingBox2 = buildBoundingBox({ width: 17, top: 4 });
    const element3 = createElement();
    const boundingBox3 = buildBoundingBox({ right: 15, bottom: 9 });
    checker(createElement(), defaultOnChange);

    check.mockImplementation((items, measurements, next: () => void) => next());
    check.mockImplementationOnce((items, measurements, next: () => void) => {
      measurements.set({ element: element1, onChange: defaultOnChange }, defaultBoundingBox);
      next();
    });
    check.mockImplementationOnce((items, measurements, next: () => void) => {
      measurements.set({ element: element2, onChange: defaultOnChange }, boundingBox2);
      next();
    });
    check.mockImplementationOnce((items, measurements, next: () => void) => {
      measurements.set({ element: element3, onChange: defaultOnChange }, boundingBox3);
      next();
    });

    nextFrame();
    nextFrame();
    nextFrame();
    nextFrame();
    expect(check).toHaveBeenCalledTimes(4);
    expect(check).toHaveBeenCalledWith(
      expect.any(Set),
      new Map([
        [{ element: element1, onChange: defaultOnChange }, defaultBoundingBox],
        [{ element: element2, onChange: defaultOnChange }, boundingBox2],
        [{ element: element3, onChange: defaultOnChange }, boundingBox3],
      ]),
      expect.any(Function),
    );
  });

  it('should request an animation frame when check calls next()', () => {
    check.mockImplementation((items, measurements, next: () => void) => next());
    checker(createElement(), defaultOnChange);
    nextFrame();

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should call check() in the following animation frame after check calls next()', () => {
    check.mockImplementation((items, measurements, next: () => void) => next());
    checker(createElement(), defaultOnChange);
    nextFrame();
    check.mockClear();
    nextFrame();

    expect(check).toHaveBeenCalledTimes(1);
  });

  it('should cancel animation frame when clear() is called', () => {
    checker(createElement(), defaultOnChange);
    checker.clear();

    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should cancel animation frame when clear() is called', () => {
    mockRequestAnimationFrame.mockReturnValue(123456789);
    checker(createElement(), defaultOnChange);
    checker.clear();

    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123456789);
  });

  it('should only contain the new item when called after clear() was called', () => {
    const element1 = createElement();
    const onChange1 = jest.fn();
    check.mockImplementation((items, measurements, next: () => void) => next());
    check.mockImplementationOnce((items, measurements, next: () => void) => {
      measurements.set({ element: element1, onChange: jest.fn() }, defaultBoundingBox);
      next();
    });

    checker(createElement(), defaultOnChange);
    checker(createElement(), defaultOnChange);
    checker(createElement(), defaultOnChange);
    nextFrame();
    checker.clear();
    expect(check).toHaveBeenCalledTimes(1);
    check.mockClear();
    mockRequestAnimationFrame.mockClear();
    checker(element1, onChange1);
    nextFrame();

    expect(check).toHaveBeenCalledTimes(1);
    expect(check).toHaveBeenCalledWith(
      new Set([
        {
          element: element1,
          onChange: onChange1,
          transform: undefined,
        },
      ]),
      new Map(),
      expect.any(Function),
    );
  });

  it('should remove item when register() callback is called', () => {
    check.mockImplementation((items, measurements, next: () => void) => next());

    const element1 = createElement();
    const callback1 = checker(element1, defaultOnChange);
    const element2 = createElement();
    const callback2 = checker(element2, defaultOnChange);
    const element3 = createElement();
    const callback3 = checker(element3, defaultOnChange);

    nextFrame();
    check.mockClear();

    callback3();
    nextFrame();

    expect(check).toHaveBeenCalledTimes(1);
    expect(check).toHaveBeenCalledWith(
      new Set([
        {
          element: element1,
          onChange: defaultOnChange,
          transform: undefined,
        },
        {
          element: element2,
          onChange: defaultOnChange,
          transform: undefined,
        },
      ]),
      new Map(),
      expect.any(Function),
    );

    check.mockClear();
    callback1();
    nextFrame();

    expect(check).toHaveBeenCalledTimes(1);
    expect(check).toHaveBeenCalledWith(
      new Set([
        {
          element: element2,
          onChange: defaultOnChange,
          transform: undefined,
        },
      ]),
      new Map(),
      expect.any(Function),
    );

    check.mockClear();
    callback2();
    nextFrame();

    expect(check).toHaveBeenCalledWith(new Set(), new Map(), expect.any(Function));

    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });
});
