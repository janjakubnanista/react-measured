import 'jest';
import { discardPosition, discardSize } from '../defaultTransforms';
import { buildBoundingBox } from '../../test/builders';

describe('defaultTransforms', () => {
  const moreAttributeNaNBox = buildBoundingBox({ left: NaN, right: NaN, width: NaN });
  const allAttributesNaNBox = buildBoundingBox({
    top: 12,
    right: 16,
    bottom: 76,
    left: 98,
    width: 122,
    height: 123,
  });

  describe('discardSize', () => {
    it('should set width and height properties to NaN', () => {
      expect(discardSize(moreAttributeNaNBox)).toEqual(
        buildBoundingBox({ ...moreAttributeNaNBox, width: NaN, height: NaN }),
      );
      expect(discardSize(allAttributesNaNBox)).toEqual(
        buildBoundingBox({ ...allAttributesNaNBox, width: NaN, height: NaN }),
      );
    });
  });

  describe('discardPosition', () => {
    it('should set width and height properties to NaN', () => {
      expect(discardPosition(moreAttributeNaNBox)).toEqual(
        buildBoundingBox({ ...moreAttributeNaNBox, top: NaN, right: NaN, bottom: NaN, left: NaN }),
      );
      expect(discardPosition(allAttributesNaNBox)).toEqual(
        buildBoundingBox({ ...allAttributesNaNBox, top: NaN, right: NaN, bottom: NaN, left: NaN }),
      );
    });
  });
});
