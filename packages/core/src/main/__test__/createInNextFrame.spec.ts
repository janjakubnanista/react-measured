import 'jest';
import { InNextFrame, createInNextFrame } from '../createInNextFrame';

const mockRequestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
const mockCancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');

const nextFrame = (): void => {
  expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);

  const callback: FrameRequestCallback = mockRequestAnimationFrame.mock.calls[0][0];
  expect(callback).toBeInstanceOf(Function);

  mockRequestAnimationFrame.mockClear();
  callback(0);
};

describe('createInNextFrame', () => {
  let inNextFrame: InNextFrame;

  beforeEach(() => {
    mockRequestAnimationFrame.mockClear();
    mockCancelAnimationFrame.mockClear();

    inNextFrame = createInNextFrame();
  });

  afterEach(() => {
    inNextFrame.cancel();
  });

  it('should request an animation frame when called', () => {
    inNextFrame(jest.fn());

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should only request one animation frame when called multiple times before the next frame', () => {
    inNextFrame(jest.fn());
    inNextFrame(jest.fn());
    inNextFrame(jest.fn());

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should only call the last callback when called multiple times', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    inNextFrame(callback1);
    inNextFrame(callback2);
    inNextFrame(callback3);

    nextFrame();
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).toHaveBeenCalledTimes(1);
  });

  it('should cancel animation frame when cancel() is called', () => {
    mockRequestAnimationFrame.mockReturnValue(123456789);
    inNextFrame(jest.fn());
    inNextFrame.cancel();

    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123456789);
  });
});
