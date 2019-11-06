import React from 'react';
import 'jest';

import { buildBoundingBox } from '../../test/builders';
import { createMeasured } from '../createMeasured';
import { BoundingBox } from '../../types';
import { mount } from 'enzyme';
import { discardSize, discardPosition } from '../../utils';

describe('createMeasured', () => {
  const defaultBoundingBox: BoundingBox = buildBoundingBox();

  function testDOMHOC<T extends keyof React.ReactHTML>(type: T, domProps: React.ComponentProps<T>): void {
    describe(`createMeasure(useBoundingBox)('${type}')`, () => {
      const useBoundingBox = jest.fn();
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
        it('should not use the discardSize transform when undefined', () => {
          mount(<MeasuredComponent {...domProps} />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), undefined, expect.any(Array));
          expect(useBoundingBox.mock.calls[0][2]).not.toContain(discardSize);
        });

        it('should not use the discardSize transform when falsy', () => {
          mount(<MeasuredComponent {...domProps} positionOnly={false} />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), undefined, expect.any(Array));
          expect(useBoundingBox.mock.calls[0][2]).not.toContain(discardSize);
        });

        it('should use the discardSize transform when truthy', () => {
          mount(<MeasuredComponent {...domProps} positionOnly />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), undefined, expect.any(Array));
          expect(useBoundingBox.mock.calls[0][2]).toContain(discardSize);
        });
      });

      describe('sizeOnly prop', () => {
        it('should not use the discardPosition transform when undefined', () => {
          mount(<MeasuredComponent {...domProps} />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), undefined, expect.any(Array));
          expect(useBoundingBox.mock.calls[0][2]).not.toContain(discardPosition);
        });

        it('should not use the discardPosition transform when falsy', () => {
          mount(<MeasuredComponent {...domProps} sizeOnly={false} />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), undefined, expect.any(Array));
          expect(useBoundingBox.mock.calls[0][2]).not.toContain(discardPosition);
        });

        it('should use the discardPosition transform when truthy', () => {
          mount(<MeasuredComponent {...domProps} sizeOnly />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), undefined, expect.any(Array));
          expect(useBoundingBox.mock.calls[0][2]).toContain(discardPosition);
        });
      });

      describe('onBoundingBoxChange prop', () => {
        it('should be passed to useBoudingBox', () => {
          const onBoundingBoxChange = jest.fn();
          mount(<MeasuredComponent {...domProps} onBoundingBoxChange={onBoundingBoxChange} />);

          expect(useBoundingBox).toHaveBeenCalledTimes(1);
          expect(useBoundingBox).toHaveBeenCalledWith(expect.any(Object), onBoundingBoxChange, expect.any(Array));
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
