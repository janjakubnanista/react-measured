import { BoundingBox, AnimationFrameChecker, CheckerItem } from 'react-measured';
import { areBoundingBoxesEqual } from 'react-measured';
import { Measurable } from './components';

interface MeasurableRef {
  measure: (
    callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void,
  ) => void;
}

const isMeasurableRef = (element: any): element is MeasurableRef => !!element && typeof element.measure === 'function';

// An implementation of Checker
export class NativeChecker extends AnimationFrameChecker<Measurable> {
  // This method iterates over the registered refs and compares
  // their boundingBoxes with the previous values
  protected check(next: () => void): void {
    const updates: Promise<unknown>[] = [];

    this.items.forEach((value: CheckerItem<Measurable>) => {
      // Nothing happens if the element is missing
      const element = value.ref.current;
      if (!element) return;

      const updatePromise = new Promise<BoundingBox>(
        (resolve: (box: BoundingBox) => void, reject: (error: Error) => void): void => {
          if (!isMeasurableRef(element)) return reject(new Error(`Element ${element.displayName} is not measurable`));

          element.measure((x, y, width, height, pageX, pageY) => {
            resolve({
              width,
              height,
              top: pageY,
              right: pageX + width,
              bottom: pageY + height,
              left: pageX,
            });
          });
        },
      ).then(
        rawBoundingBox => {
          // And apply per-item transformation if needed
          const boundingBox = value.transform ? value.transform(rawBoundingBox) : rawBoundingBox;

          // And compare to its previous bounding box
          const previousMeasurement = this.measurements.get(value.ref);
          if (previousMeasurement && areBoundingBoxesEqual(boundingBox, previousMeasurement.boundingBox)) return;

          // And only if they are different update the element bounding box in the map
          this.measurements.set(value.ref, { element, boundingBox });

          // Finally add the corresponding onChange callback to the result array
          // to be executed in the next animation frame
          // in order not to mix read/write operations on elements
          value.onChange(boundingBox);
        },
        // Make sure one promise does not bring the whole check down
        () => {},
      );

      updates.push(updatePromise);
    });

    if (!updates.length) return next();

    Promise.all(updates).finally(next);
  }
}
