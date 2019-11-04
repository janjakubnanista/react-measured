import React from 'react';

import { storiesOf } from '@storybook/react';
import { number, withKnobs, select } from '@storybook/addon-knobs';
import { BoundingBoxProvider } from '../src/index';
import { boxStyles, Heading1, Paragraph } from './components';
import styled from 'styled-components';
import { useState } from '@storybook/addons';
import { Bubble } from './components/visual';
import { FixedPosition } from './components/position';
import { Motion, spring } from 'react-motion';
import { BoundingBoxOrigin } from '../src/components/BoundingBoxProvider';
import { BoundingBox } from '@react-width-height/core';
import { left, right } from './utils/points';

const RENDER_EXAMPLE = `<BoundingBoxProvider>
  {box => (
    \`\${box.width} x \${box.height}\`
  )}
</BoundingBoxProvider>
`;

const getCallback = (top: number, left: number) => `onBoundingBoxChange(({ top: ${top}px, left: ${left}px }) => {<br/>
\u00A0\u00A0<br/>
})
  {box => (
    \`\${box.width} x \${box.height}\`
  )}
</BoundingBoxProvider>
`;

const stories = storiesOf('react-width-height', module);
stories.addDecorator(withKnobs as any);

stories.add('Introduction', () => {
  const origin = select<BoundingBoxOrigin>('Origin', ['viewport', 'document'], 'viewport');
  const [firstBoundingBox, setFirstBoundingBox] = useState<BoundingBox | undefined>(undefined);
  const [secondBoundingBox, setSecondBoundingBox] = useState<BoundingBox | undefined>(undefined);

  const [firstStopBoundingBox, setFirstStopBoundingBox] = useState<BoundingBox | undefined>(undefined);
  const [secondStopBoundingBox, setSecondStopBoundingBox] = useState<BoundingBox | undefined>(undefined);
  const [thirdStopBoundingBox, setThirdStopBoundingBox] = useState<BoundingBox | undefined>(undefined);

  const threshold = 0;
  // const stopBoundingBox = thirdStopBoundingBox && thirdStopBoundingBox.top < threshold ? thirdStopBoundingBox
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

      {firstBoundingBox && (
        // <FixedPosition top={Math.min(300, firstBoundingBox.bottom + 150)} left="8vw">
        //   <Bubble color="#FF6F61" pointAt={firstBoundingBox} children={'like the\u00A0one there'} />
        // </FixedPosition>
        // <FixedPosition style={{ top: firstBoundingBox.bottom < 100 ? 'absolute' : 'fixed' }} top={Math.min(300, firstBoundingBox.bottom + 150)} left="8vw">
        //   <Bubble color="#FF6F61" pointAt={firstBoundingBox} children={'like the\u00A0one there'} />
        // </FixedPosition>
        <FixedPosition
          style={{ transform: `translate(0px, ${Math.min(400, firstBoundingBox.bottom)}px)` }}
          top={0}
          left="8vw"
        >
          <Bubble color="#FF6F61" pointAt={firstBoundingBox}>
            like the one there
          </Bubble>
        </FixedPosition>
      )}

      {/* <LotsOfSpaceRight>
        <HorizontalContainer>
          <Box origin={origin} onBoundingBoxChange={setFirstBoundingBox}>
            {boundingBox => (
              <div>
                {Math.round(boundingBox.left)} x {Math.round(boundingBox.top)}
              </div>
            )}
          </Box>
        </HorizontalContainer>
      </LotsOfSpaceRight> */}

      {/* <LotsOfSpace>
        <Heading1>They can also let other components know</Heading1>
        {secondBoundingBox && (
          <Paragraph>
            {`onBoundingBoxChange(({ top: ${format(secondBoundingBox.top)}px, left: ${format(
              secondBoundingBox.left,
            )}px }) => {`}
            <br />
            <br />
            {`})`}
          </Paragraph>
        )}
      </LotsOfSpace> */}

      {/* <LotsOfSpace>
        {secondBoundingBox && (
          <FixedPosition
            left={secondBoundingBox.left + secondBoundingBox.width / 2 - 50}
            top={secondBoundingBox.top - 130}
          >
            <Bubble color="#009499" children={'like this\u00A0one here'} />
          </FixedPosition>
        )}

        <BouncyBox onBoundingBoxChange={setSecondBoundingBox}>
          {() => 'This one is animated using CSS keyframe animation'}
        </BouncyBox>
      </LotsOfSpace> */}

      <SomeSpace>
        <Box onBoundingBoxChange={setFirstStopBoundingBox} />
      </SomeSpace>

      <SomeSpaceRight>
        <Box onBoundingBoxChange={setSecondStopBoundingBox} />
      </SomeSpaceRight>

      <SomeSpace>
        <Box onBoundingBoxChange={setThirdStopBoundingBox} />
      </SomeSpace>

      {/* {stopBoundingBox && <AB boundingBox={stopBoundingBox} />} */}

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
            // console.log('interplated', interpolated);
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
      <LotsOfSpace>a</LotsOfSpace>
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

const Box = styled(BoundingBoxProvider)`
  ${boxStyles};
`;

const EmptyBox = styled.div`
  ${boxStyles};
`;

const BouncyBox = styled(Box)`
  animation: bounce 1s infinite alternate;
`;

const format = (value: number) => Math.round(value);
