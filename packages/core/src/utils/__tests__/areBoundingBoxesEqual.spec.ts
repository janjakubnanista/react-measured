import 'jest';
import { areBoundingBoxesEqual } from '../areBoundingBoxesEqual';
import { buildBoundingBox } from '../../test/builders';

describe('areBoundingBoxesEqual', () => {
  const defaultBoundingBox = buildBoundingBox();
  const oneAttributeNaNBox = buildBoundingBox({ left: NaN });
  const moreAttributeNaNBox = buildBoundingBox({ left: NaN, right: NaN, width: NaN });
  const allAttributesNaNBox = buildBoundingBox({
    top: NaN,
    right: NaN,
    bottom: NaN,
    left: NaN,
    width: NaN,
    height: NaN,
  });

  it('should return true when comparing object to itself', () => {
    expect(areBoundingBoxesEqual(defaultBoundingBox, defaultBoundingBox)).toBeTruthy();
  });

  it('should return true when comparing identical objects with only numeric attributes', () => {
    expect(areBoundingBoxesEqual(defaultBoundingBox, { ...defaultBoundingBox }));
  });

  it('should return true when comparing identical objects with NaN attributes', () => {
    expect(areBoundingBoxesEqual(oneAttributeNaNBox, { ...oneAttributeNaNBox })).toBeTruthy();
    expect(areBoundingBoxesEqual(moreAttributeNaNBox, { ...moreAttributeNaNBox })).toBeTruthy();
    expect(areBoundingBoxesEqual(allAttributesNaNBox, { ...allAttributesNaNBox })).toBeTruthy();
  });

  it('should return true when comparing objects that differ by less than precision value', () => {
    const slightlyBiggerBox = buildBoundingBox({ left: 1e-5 });

    expect(areBoundingBoxesEqual(defaultBoundingBox, slightlyBiggerBox)).toBeTruthy();
    expect(areBoundingBoxesEqual(defaultBoundingBox, slightlyBiggerBox, 1e-4)).toBeTruthy();
  });

  it('should return true when comparing objects that differ by precision value', () => {
    const slightlyBiggerBox = buildBoundingBox({ left: 1e-3 });

    expect(areBoundingBoxesEqual(defaultBoundingBox, slightlyBiggerBox)).toBeTruthy();
    expect(areBoundingBoxesEqual(defaultBoundingBox, slightlyBiggerBox, 1e-3)).toBeTruthy();
  });

  it('should return false when comparing objects that differ by more than precision value', () => {
    const veryMuchBiggerBox = buildBoundingBox({ left: 100 });

    expect(areBoundingBoxesEqual(defaultBoundingBox, veryMuchBiggerBox)).toBeFalsy();
    expect(areBoundingBoxesEqual(defaultBoundingBox, veryMuchBiggerBox, 1e-3)).toBeFalsy();
  });

  it('should return false when comparing objects that differ in attribute changing from NaN to number', () => {
    expect(areBoundingBoxesEqual(oneAttributeNaNBox, defaultBoundingBox)).toBeFalsy();
    expect(areBoundingBoxesEqual(moreAttributeNaNBox, defaultBoundingBox)).toBeFalsy();
    expect(areBoundingBoxesEqual(allAttributesNaNBox, defaultBoundingBox)).toBeFalsy();
  });
});
