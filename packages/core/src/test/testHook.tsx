import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

export type TTestHookProps<P> = {
  callback: (props: P) => void;
  testProp: P;
};

export type TTestHookWrapper<P = void> = ReactWrapper<TTestHookProps<P>>;

const TestHook: React.FC<TTestHookProps<unknown>> = ({ callback, testProp }) => {
  callback(testProp);

  return null;
};

export function testHook<P>(callback: (testProp: P) => void, initialTestProp?: P): TTestHookWrapper<P> {
  return mount(<TestHook callback={callback} testProp={initialTestProp} />);
}
