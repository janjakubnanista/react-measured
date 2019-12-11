import 'jest';
import React from 'react';

import { Measured } from '../Measured';
import { htmlTags, HTMLTag } from '../../utils/htmlTags';
import { mount } from 'enzyme';
import { MeasuredProps } from 'react-measured';
import styled from 'styled-components';

// There is a lot of validateDOMNesting errors since we are rendering all sorts of HTML tags
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Measured', () => {
  const htmlProps: React.HTMLProps<HTMLElement> = {
    'aria-placeholder': 'placeholder',
    allowTransparency: true,
    className: 'class-name',
    disabled: false,
    encType: 'enc-type',
    formAction: 'form-action',
    height: '799px',
    inputMode: 'email',
    keyType: 'key-type',
    label: 'label',
    marginHeight: 10,
    name: 'name',
    onAbort: jest.fn(),
    pattern: 'pattern',
    readOnly: true,
    scrolling: 'scrolling',
    tabIndex: 11,
    unselectable: 'on',
    value: 'value',
    width: '100%',
  };

  const htmlPropsWithChildren: React.HTMLProps<HTMLElement> = {
    ...htmlProps,
    children: <span>CHILDREN!!!</span>,
  };

  const measuredProps: MeasuredProps = {
    onBoundingBoxChange: jest.fn(),
    sizeOnly: true,
    positionOnly: false,
  };

  const voidElements: HTMLTag[] = ['br', 'embed', 'hr', 'img', 'input'];

  htmlTags.forEach(htmlTag => {
    it(`Measured.${htmlTag} should pass down all the wrapped component props`, () => {
      const MeasuredHTMLTag = Measured[htmlTag];
      const isVoidElement = voidElements.includes(htmlTag);
      const props = isVoidElement ? htmlProps : htmlPropsWithChildren;

      expect(MeasuredHTMLTag).toBeInstanceOf(Function);

      const component = mount(<MeasuredHTMLTag {...measuredProps} {...(props as any)} />);
      expect(component.childAt(0).is(htmlTag)).toBeTruthy();
      expect(component.childAt(0).props()).toEqual(props);
    });

    it(`Measured.${htmlTag} should pass down all the wrapped component props`, () => {
      const StyledComponent = (styled as any)[htmlTag]``;
      const MeasuredStyledComponent = Measured(StyledComponent);
      const isVoidElement = voidElements.includes(htmlTag);
      const props = isVoidElement ? htmlProps : htmlPropsWithChildren;

      expect(MeasuredStyledComponent).toBeInstanceOf(Function);

      const component = mount(<MeasuredStyledComponent {...measuredProps} {...(props as any)} />);
      expect(component.childAt(0).is(StyledComponent)).toBeTruthy();
      expect(component.childAt(0).props()).toEqual(props);
    });
  });
});
