export interface InNextFrame {
  (callback: () => void): void;

  cancel: () => void;
}

export const createInNextFrame = (): InNextFrame => {
  let animationFrameId: number | void;
  let callbackToExecute: () => void;

  const cancel = (): void => {
    if (animationFrameId) animationFrameId = window.cancelAnimationFrame(animationFrameId);
  };

  const inNextFrame = (callback: () => void): void => {
    callbackToExecute = callback;

    if (!animationFrameId) {
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = undefined;

        callbackToExecute();
      });
    }
  };

  return Object.assign(inNextFrame, { cancel });
};
