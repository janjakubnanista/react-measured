import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { BoundingBoxProvider } from '../src/index';
import { Container, Button, Heading1, Paragraph, Heading2 } from './components';
import styled from 'styled-components';
import { useState } from '@storybook/addons';
import { Bubble } from './components/visual';
import { FixedPosition } from './components/position';
import { BoundingBox } from 'react-bounding-box';

const stories = storiesOf('react-width-height', module);
stories.addDecorator(withKnobs as any);

const BUBBLE_TARGET = { top: 100, left: 200, width: 100, height: 100, right: 200, bottom: 200 };

stories.add(
  'Dropdown example',
  () => {
    const [open1, setOpen1] = useState<boolean>(false);
    const [open2, setOpen2] = useState<boolean>(false);
    const [boundingBox1, setBoundingBox1] = useState<BoundingBox | undefined>(undefined);
    const [boundingBox2, setBoundingBox2] = useState<BoundingBox | undefined>(undefined);
    const [boundingBox3, setBoundingBox3] = useState<BoundingBox | undefined>(undefined);
    const [boundingBox4, setBoundingBox4] = useState<BoundingBox | undefined>(undefined);
    const onToggle1 = () => setOpen1(!open1);
    const onToggle2 = () => setOpen2(!open2);

    // const boundingBox = boundingBox1 && boundingBox1.bottom > 0 ? boundingBox1 : boundingBox2;
    const boundingBox = boundingBox2 || boundingBox3 || boundingBox1;

    // TODO An arrow always pointing at an element on the page

    return (
      <Container>
        <FixedPosition top={'10vh'} left={'10vw'}>
          <Bubble pointAt={boundingBox} />
        </FixedPosition>
        <FixedPosition bottom={'8vh'} right={'30vw'}>
          <Bubble pointAt={boundingBox} />
        </FixedPosition>
        <FixedPosition top={'15vh'} right={'5vw'}>
          <Bubble pointAt={boundingBox} />
        </FixedPosition>

        <Content>
          <Heading1 style={{ width: '35%', minWidth: 320 }}>
            Use it to align components living in different places in the DOM
          </Heading1>

          <Paragraph style={{ width: '30%', minWidth: 300 }}>
            To create a popover aligned with an element no matter what
          </Paragraph>

          <Button onClick={onToggle1} style={{ position: 'relative' }}>
            <BoundingBoxProvider
              onBoundingBoxChange={setBoundingBox1}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />
            Open such a popover!
          </Button>

          {boundingBox1 && open1 ? (
            <Dropdown
              style={{
                ...getDropdownStyle('bottom', boundingBox1),
              }}
            >
              <Heading2>Wow!</Heading2>

              <Paragraph>What about a nested popover though, would that work?</Paragraph>

              <Button onClick={onToggle2} style={{ position: 'relative', marginTop: 20 }}>
                <BoundingBoxProvider
                  onBoundingBoxChange={setBoundingBox3}
                  style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />
                Give it a go &gt;
              </Button>
            </Dropdown>
          ) : null}

          {boundingBox3 && open2 ? (
            <Dropdown
              className={open1 ? undefined : 'parentless'}
              style={{
                ...getDropdownStyle('bottom', boundingBox3),
              }}
            >
              {open1 ? (
                <>
                  <Heading1>Nice!</Heading1>

                  <Paragraph>And I could go on like this but we both have better things to do I guess.</Paragraph>

                  <Button onClick={onToggle2} style={{ position: 'relative', marginTop: 20 }}>
                    <BoundingBoxProvider onBoundingBoxChange={setBoundingBox2} />
                    Close the dropdown now
                  </Button>
                </>
              ) : (
                <>
                  <Heading2>Oh no what happened?! Must be a bug, my bad.</Heading2>
                  <Paragraph>
                    In the meantime though notice how the moment the dropdown button reappears everything is instantly
                    aligned.
                  </Paragraph>
                  <Button onClick={onToggle1}>
                    <BoundingBoxProvider onBoundingBoxChange={setBoundingBox4} />
                    Show the button
                  </Button>
                </>
              )}
            </Dropdown>
          ) : null}
        </Content>
      </Container>
    );
  },
  {
    info: { inline: true },
    notes: `
    heyyyy
    `,
  },
);

const Dropdown = styled.div`
  width: 200px;
  padding: 30px 10px;
  margin-top: 3px;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #eee;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;

  &.parentless {
    top: 100% !important;
    transition: all ease-in 0.2s;
    transform: translate(-50%, -100%) !important;
  }
`;

const Content = styled.div`
  padding-top: 100px;
  height: 200vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

type Align = 'left' | 'right' | 'top' | 'bottom';

// const getStyle = (align: Align): React.CSSProperties => ({
//   position: 'absolute',
//   left: align === 'left' ? 0 : (align === 'top' || align === 'bottom' ? '50%' : undefined),
//   right: align === 'right' ? 0 : undefined,
//   top: align === 'top' ? 0 : (align === 'left' || align === 'right' ? '50%' : undefined),
//   bottom: align === 'bottom' ? 0 : undefined,
// });

const OFFSET = 5;

const getDropdownStyle = (align: Align, alignTo: BoundingBox): React.CSSProperties => ({
  position: 'fixed',
  left:
    align === 'right'
      ? alignTo.right + OFFSET
      : align === 'top' || align === 'bottom'
      ? alignTo.left + alignTo.width / 2
      : undefined,
  right: align === 'left' ? window.innerWidth - alignTo.left - OFFSET : undefined,
  top:
    align === 'bottom'
      ? alignTo.bottom + OFFSET
      : align === 'left' || align === 'right'
      ? alignTo.top + alignTo.height / 2
      : undefined,
  bottom: align === 'top' ? window.innerHeight - alignTo.top - OFFSET : undefined,
  transform:
    align === 'top' || align === 'bottom'
      ? 'translate(-50%, 0)'
      : align === 'left' || align === 'right'
      ? 'translate(0, -50%)'
      : undefined,
});
