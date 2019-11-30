import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Measured } from '../src/index';
import { boxStyles, Heading1, Paragraph } from './components';
import styled from 'styled-components';
import { Bubble } from './components/visual';
import { FixedPosition } from './components/position';
import { Motion, spring } from 'react-motion';
import { BoundingBox } from 'react-measured';
import { left, right } from './utils/points';

const stories = storiesOf('react-measured', module);
stories.addDecorator(withKnobs as any);

stories.add('Introduction', () => {
  const [firstStopBoundingBox, setFirstStopBoundingBox] = useState<BoundingBox | undefined>(undefined);
  const [secondStopBoundingBox, setSecondStopBoundingBox] = useState<BoundingBox | undefined>(undefined);
  const [thirdStopBoundingBox, setThirdStopBoundingBox] = useState<BoundingBox | undefined>(undefined);

  const threshold = 0;
  const stopBoundingBox =
    firstStopBoundingBox && firstStopBoundingBox.top < threshold
      ? secondStopBoundingBox && secondStopBoundingBox.top < threshold
        ? thirdStopBoundingBox
        : secondStopBoundingBox
      : firstStopBoundingBox;
  const stopBoundingBoxAnchor =
    stopBoundingBox === secondStopBoundingBox ? left(stopBoundingBox) : right(stopBoundingBox);
  const stopBoundingBoxPlace =
    stopBoundingBox === secondStopBoundingBox ? left(stopBoundingBox, -130, -50) : right(stopBoundingBox, 30, -50);
  const stopBoundingBoxLabel =
    stopBoundingBox === firstStopBoundingBox
      ? 'to this one'
      : stopBoundingBox === secondStopBoundingBox
      ? 'or this one'
      : 'or even the one here!';

  return (
    <Container>
      <Heading1>
        <div>Your components</div>
        <div>now have access to their size and position.</div>
      </Heading1>

      <Paragraph>And they can use it whenever they want</Paragraph>

      <SomeSpace>
        <Box onBoundingBoxChange={setFirstStopBoundingBox} />
      </SomeSpace>

      <SomeSpaceRight>
        <Box onBoundingBoxChange={setSecondStopBoundingBox} />
      </SomeSpaceRight>

      <SomeSpace>
        <Box onBoundingBoxChange={setThirdStopBoundingBox} />
      </SomeSpace>

      {stopBoundingBoxPlace && (
        <Motion
          defaultStyle={{
            left: stopBoundingBoxPlace.left,
            top: stopBoundingBoxPlace.top,
          }}
          style={{
            left: spring(stopBoundingBoxPlace.left, { stiffness: 20, damping: 7 }),
            top: spring(stopBoundingBoxPlace.top, { stiffness: 20, damping: 7 }),
          }}
        >
          {interpolated => {
            return (
              <FixedPosition top={interpolated.top} left={interpolated.left}>
                <Bubble color="#263056" pointAt={stopBoundingBoxAnchor}>
                  {stopBoundingBoxLabel}
                </Bubble>
              </FixedPosition>
            );
          }}
        </Motion>
      )}

      <LotsOfSpace></LotsOfSpace>
      <LotsOfSpace></LotsOfSpace>
      <LotsOfSpace></LotsOfSpace>
    </Container>
  );
});

const Container = styled.div`
  padding: 32px;
  min-width: 320px;
  margin: 0 auto;
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

const EmptyBox = styled.div`
  ${boxStyles};
`;

const BouncyBox = styled(Box)`
  animation: bounce 1s infinite alternate;
`;

const format = (value: number) => Math.round(value);
