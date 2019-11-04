import {
  BoundingBox,
  CheckerItem,
  CheckerRef,
  CheckerTransform,
  CheckerChangeHandler,
  CheckerUnregisterCallback,
  CheckerImplementation,
  CheckerTransformInput,
} from '@react-width-height/core';
import { areBoundingBoxesEqual } from '@react-width-height/core';

// An internal type used for passing callbacks to be executed between animation frames
type CheckerUpdateCallback = () => void;

const isValidTransform = (transform: CheckerTransformInput): transform is CheckerTransform<BoundingBox> => !!transform;

// An implementation of Checker
class Checker<T> {
  private animationFrameId: number | undefined;

  private items: Set<CheckerItem<T>> = new Set();

  private boundingBoxes: Map<CheckerRef<T>, BoundingBox> = new Map();

  constructor(private measure: CheckerTransform<T>) {}

  // This method iterates over the registered refs and compares
  // their boundingBoxes with the previous values
  private check(): CheckerUpdateCallback[] {
    const callbacks: CheckerUpdateCallback[] = [];

    this.items.forEach((value: CheckerItem<T>) => {
      // Nothing happens if the element is missing
      const element = value.ref.current;
      if (!element) return;

      // Measure the the element bounding box now
      const rawBoundingBox = this.measure(element);

      // And apply per-item transformation if needed
      const boundingBox = value.transforms.reduce((box, transform) => transform(box), rawBoundingBox);

      // And compare to its previous bounding box
      const previousBoundingBox = this.boundingBoxes.get(value.ref);
      if (areBoundingBoxesEqual(boundingBox, previousBoundingBox)) return;

      // And only if they are different update the element bounding box in the map
      this.boundingBoxes.set(value.ref, boundingBox);

      // Finally add the corresponding onChange callback to the result array
      // to be executed in the next animation frame
      // in order not to mix read/write operations on elements
      callbacks.push((): void => value.onChange(boundingBox));
    });

    return callbacks;
  }

  // Starts periodically checking the registered refs
  private loop(): void {
    if (this.animationFrameId) return;

    this.animationFrameId = window.requestAnimationFrame(() => {
      // In case checking was cancelled
      if (!this.animationFrameId) return;

      const updates = this.check();
      this.animationFrameId = window.requestAnimationFrame(() => {
        // In case checking was cancelled
        if (!this.animationFrameId) return;

        updates.forEach(update => update());

        this.animationFrameId = undefined;
        this.loop();
      });
    });
  }

  public start(): void {
    this.loop();
  }

  public stop(): void {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public register(
    ref: CheckerRef<T>,
    onChange: CheckerChangeHandler,
    ...transforms: CheckerTransformInput[]
  ): CheckerUnregisterCallback {
    const item: CheckerItem<T> = { ref, transforms: transforms.filter(isValidTransform), onChange };
    this.items.add(item);
    this.loop();

    return (): void => {
      this.items.delete(item);
      this.boundingBoxes.delete(item.ref);

      if (this.items.size === 0) this.stop();
    };
  }

  public clear(): void {
    this.stop();

    this.items.clear();
    this.boundingBoxes.clear();
  }
}

export const createChecker = <T>(measure: CheckerTransform<T>): CheckerImplementation<T> => {
  return new Checker(measure);
};
