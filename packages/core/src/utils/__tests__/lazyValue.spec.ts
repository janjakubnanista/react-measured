import 'jest';
import { lazyValue } from '../lazyValue';

describe('lazyValue', () => {
  const object = {};

  const undefinedFactory = jest.fn(() => undefined);
  const emptyStringFactory = jest.fn(() => '');
  const nonEmptyStringFactory = jest.fn(() => 'Some value');
  const falseFactory = jest.fn(() => false);
  const objectFactory = jest.fn(() => object);

  const testWithFactory = <T>(value: T, factory: jest.Mock): void => {
    it('should return the value returned from the value factory', () => {
      expect(lazyValue(factory)()).toBe(value);
    });

    it('should not call the value factory when created', () => {
      factory.mockClear();
      lazyValue(factory);

      expect(factory).not.toHaveBeenCalled();
    });

    it('should call the value factory when first called', () => {
      factory.mockClear();
      lazyValue(factory)();

      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should not call the value factory when called again', () => {
      factory.mockClear();
      const lazy = lazyValue(factory);

      lazy();
      lazy();
      lazy();

      expect(lazy()).toBe(value);
      expect(factory).toHaveBeenCalledTimes(1);
    });
  };

  describe('with undefined', () => testWithFactory(undefined, undefinedFactory));
  describe('with false', () => testWithFactory(false, falseFactory));
  describe('with empty string', () => testWithFactory('', emptyStringFactory));
  describe('with non-empty string', () => testWithFactory('Some value', nonEmptyStringFactory));
  describe('with object', () => testWithFactory(object, objectFactory));
});
