import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Measured } from '../src/index';
import { boxStyles, Heading1, Paragraph } from './components';
import styled from 'styled-components';
import { BoundingBox } from 'react-measured';
import { formatDistance } from './utils/format';

const WINDOW_ADD_LISTENER = `window.addEventListener(
  'resize',
  this.handleResize
);`;

const stories = storiesOf('react-measured-dom', module);
stories.addDecorator(withKnobs);

stories.add('Introduction', () => {
  const [firstBoundingBox, setFirstBoundingBox] = useState<BoundingBox | undefined>(undefined);

  return (
    <Container>
      <Heading1>
        <div>Access size &amp; position</div>
        <div>of your components</div>
      </Heading1>

      <Paragraph>
        And say goodbye to <Code>{WINDOW_ADD_LISTENER}</Code> in your component code.
      </Paragraph>

      <Paragraph></Paragraph>

      <LotsOfSpace></LotsOfSpace>

      <SomeSpaceRight>
        <Box onBoundingBoxChange={setFirstBoundingBox} />
      </SomeSpaceRight>

      <SomeSpace></SomeSpace>

      <Rulers>
        {containerBoundingBox => {
          return (
            <>
              <RulerVertical
                style={{
                  left: firstBoundingBox ? firstBoundingBox.left + firstBoundingBox.width / 2 : 0,
                  top: 0,
                  height: firstBoundingBox ? firstBoundingBox.top : 0,
                  opacity: firstBoundingBox ? firstBoundingBox.top / 300 : 1,
                }}
              >
                {firstBoundingBox ? formatDistance(firstBoundingBox.top) : ''}
              </RulerVertical>

              <RulerVertical
                style={{
                  left: firstBoundingBox ? firstBoundingBox.left + firstBoundingBox.width / 2 : 0,
                  bottom: 0,
                  height: firstBoundingBox ? containerBoundingBox.bottom - firstBoundingBox.bottom : 0,
                  opacity: firstBoundingBox ? (containerBoundingBox.bottom - firstBoundingBox.bottom) / 300 : 1,
                }}
              >
                {firstBoundingBox ? formatDistance(containerBoundingBox.bottom - firstBoundingBox.bottom) : ''}
              </RulerVertical>
            </>
          );
        }}
      </Rulers>
    </Container>
  );
});

const COLORS = {
  blueDepths: '#263056',
  limpetShell: '#98DDDE',
  livingCoral: '#FF6F61',
  seaPink: '#DE98AB',
  vibrantYellow: '#FFDA29',
  viridianGreen: '#009499',
};

const Rulers = styled(Measured.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
`;

const Code = styled.pre`
  color: ${COLORS.livingCoral};
  padding: 10px;
  background: #f5f5f599;
  border-radius: 3px;
`;

const RulerVertical = styled.div`
  color: ${COLORS.blueDepths};
  display: flex;
  align-items: center;
  padding-left: 10px;
  position: fixed;
  border-left: 1px dashed ${COLORS.limpetShell};

  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 10px;
    transform: translate(-50%, 0);
    border-top: 1px dashed ${COLORS.limpetShell};
  }

  &:before {
    top: 0;
  }

  &:after {
    bottom: 0;
  }
`;

const Container = styled.div`
  padding: 32px;
  min-width: 320px;
  max-width: 800px;
  min-height: 150vh;
`;

const SomeSpace = styled.div`
  margin-top: 40vh;
`;

const SomeSpaceRight = styled(SomeSpace)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const LotsOfSpace = styled.div`
  margin-top: 55vh;
`;

const LotsOfSpaceRight = styled(LotsOfSpace)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Box = styled(Measured.div)`
  ${boxStyles};
`;

const format = (value: number) => Math.round(value);
