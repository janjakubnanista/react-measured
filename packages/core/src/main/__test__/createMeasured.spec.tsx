import React from 'react';
import 'jest';

import { buildBoundingBox } from '../../test/builders';
import { createMeasured } from '../createMeasured';
import { BoundingBox } from '../../types';
import { mount } from 'enzyme';
import { UseBoundingBox } from '../createUseBoundingBox';

describe('createMeasured', () => {
  const defaultBoundingBox: BoundingBox = buildBoundingBox();

  function testDOMHOC<T extends keyof React.ReactHTML>(type: T, domProps: React.ComponentProps<T>): void {
    describe(`createMeasure(useBoundingBox)('${type}')`, () => {
      const useBoundingBox = jest.fn<
        ReturnType<UseBoundingBox<HTMLElement>>,
        Parameters<UseBoundingBox<HTMLElement>>
      >();
      const measured = createMeasured<HTMLElement>(useBoundingBox);
      const MeasuredComponent = measured(type);

      beforeEach(() => {
        useBoundingBox.mockReset();
      });

      it('should render the wrapped component', () => {
        const component = mount(<MeasuredComponent {...domProps} />);

        const root = component.find(type);
        expect(root.exists()).toBeTruthy();
        expect(root).toHaveLength(1);

        expect(component.getDOMNode()).toBeInstanceOf(HTMLElement);
        expect(component.getDOMNode().tagName).toBe(type.toUpperCase());
      });

      it('should not pass Measured props down to the wrapped component', () => {
        const component = mount(
          <MeasuredComponent {...domProps} onBoundingBoxChange={jest.fn()} sizeOnly positionOnly />,
        );

        const root = component.find(type);
        expect(root.props()).toEqual(domProps);
      });

      describe('when boundingBox is undefined', () => {
        beforeEach(() => {
          useBoundingBox.mockReturnValue(undefined);
        });

        it('should render children when children is ReactNode', () => {
          const children = <div className="test" />;
          const component = mount(<MeasuredComponent {...domProps}>{children}</MeasuredComponent>);

          const root = component.find(type);
          expect(root.children().equals(children)).toBeTruthy();
        });

        it('should not render children when children is a callback', () => {
          const children = <div className="test" />;
          const childrenCallback = jest.fn().mockReturnValue(children);
          const component = mount(<MeasuredComponent {...domProps}>{childrenCallback}</MeasuredComponent>);

          const root = component.find(type);
          expect(root.children().exists()).toBeFalsy();
          expect(childrenCallback).not.toHaveBeenCalled();
        });
      });

      describe('when boundingBox is defined', () => {
        beforeEach(() => {
          useBoundingBox.mockReturnValue(defaultBoundingBox);
        });

        it('should render children when children is ReactNode', () => {
          const children = <div className="test" />;
          const component = mount(<MeasuredComponent {...domProps}>{children}</MeasuredComponent>);

          const root = component.find(type);
          expect(root.children().equals(children)).toBeTruthy();
        });

        it('should render children when children is a callback', () => {
          const children = <div className="test" />;
          const childrenCallback = jest.fn().mockReturnValue(children);
          const component = mount(<MeasuredComponent {...domProps}>{childrenCallback}</MeasuredComponent>);

          const root = component.find(type);
          expect(root.children().equals(children)).toBeTruthy();
          expect(childrenCallback).toHaveBeenCalledTimes(1);
          expect(childrenCallback).toHaveBeenCalledWith(defaultBoundingBox);
        });
      });

      describe('positionOnly prop', () => {
        it('should not use the discardPosition transform when undefined', () => {
          const boundingBox = buildBoundingBox({ width: 100, height: 20 });
          useBoundingBox.mockImplementationOnce((element, onChange, transform) => {
            expect(transform).toBeInstanceOf(Function);
            expect(transform!(boundingBox)).toBe(boundingBox);

            return undefined;
          });

          mount(<MeasuredComponent {...domProps} />);
          expect(useBoundingBox).toHaveBeenCalledTimes(1);
        });

        it('should not use the discardSize transform when falsy', () => {
          const boundingBox = buildBoundingBox({ width: 100, height: 20 });
          useBoundingBox.mockImplementationOnce((element, onChange, transform) => {
            expect(transform).toBeInstanceOf(Function);
            expect(transform!(boundingBox)).toBe(boundingBox);

            return undefined;
          });

          mount(<MeasuredComponent {...domProps} positionOnly={false} />);
          expect(useBoundingBox).toHaveBeenCalledTimes(1);
        });

        it('should use the discardSize transform when truthy', () => {
          const boundingBox = buildBoundingBox({ width: 100, height: 20 });
          useBoundingBox.mockImplementationOnce((element, onChange, transform) => {
            expect(transform).toBeInstanceOf(Function);
            expect(transform!(boundingBox)).toEqual(buildBoundingBox({ width: NaN, height: NaN }));

            return undefined;
          });

          mount(<MeasuredComponent {...domProps} positionOnly={true} />);
          expect(useBoundingBox).toHaveBeenCalledTimes(1);
        });
      });

      describe('sizeOnly prop', () => {
        it('should not use the discardPosition transform when undefined', () => {
          const boundingBox = buildBoundingBox({ top: 100, left: 20 });
          useBoundingBox.mockImplementationOnce((element, onChange, transform) => {
            expect(transform).toBeInstanceOf(Function);
            expect(transform!(boundingBox)).toBe(boundingBox);

            return undefined;
          });

          mount(<MeasuredComponent {...domProps} />);
          expect(useBoundingBox).toHaveBeenCalledTimes(1);
        });

        it('should not use the discardPosition transform when falsy', () => {
          const boundingBox = buildBoundingBox({ top: 100, left: 20 });
          useBoundingBox.mockImplementationOnce((element, onChange, transform) => {
            expect(transform).toBeInstanceOf(Function);
            expect(transform!(boundingBox)).toBe(boundingBox);

            return undefined;
          });

          mount(<MeasuredComponent {...domProps} sizeOnly={false} />);
          expect(useBoundingBox).toHaveBeenCalledTimes(1);
        });

        it('should use the discardPosition transform when truthy', () => {
          const boundingBox = buildBoundingBox({ top: 100, left: 20 });
          useBoundingBox.mockImplementationOnce((element, onChange, transform) => {
            expect(transform).toBeInstanceOf(Function);
            expect(transform!(boundingBox)).toEqual(buildBoundingBox({ top: NaN, left: NaN, right: NaN, bottom: NaN }));

            return undefined;
          });

          mount(<MeasuredComponent {...domProps} sizeOnly={true} />);
          expect(useBoundingBox).toHaveBeenCalledTimes(1);
        });
      });

      describe('onBoundingBoxChange prop', () => {
        it('should be passed to useBoudingBox', () => {
          const onBoundingBoxChange = jest.fn();
          mount(<MeasuredComponent {...domProps} onBoundingBoxChange={onBoundingBoxChange} />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), onBoundingBoxChange, expect.any(Function));
        });
      });
    });
  }

  // Just a couple random DOM test suites
  testDOMHOC('div', {
    style: {},
    className: 'className',
    'aria-atomic': true,
  });

  testDOMHOC('span', {
    style: {},
    className: 'className',
    'aria-atomic': true,
  });

  testDOMHOC('canvas', {
    style: {},
    width: '120',
  });
});
