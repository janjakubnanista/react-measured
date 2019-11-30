import React, { useState, useCallback } from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { boxStyles } from './components';
import styled from 'styled-components';
import { BoundingBox } from 'react-measured';
import { Measured } from '../src/main/Measured';

const stories = storiesOf('react-measured-dom', module);
stories.addDecorator(withKnobs);

stories.add('Element size', () => {
  const [boundingBox, setBoundingBox] = useState<BoundingBox | undefined>(undefined);

  const handleBoundingBoxChange = useCallback(
    (boundingBox: BoundingBox) => {
      console.log('changed', { boundingBox });

      setBoundingBox(boundingBox);
    },
    [setBoundingBox],
  );

  return (
    <Container>
      <MeasuredTextArea sizeOnly onBoundingBoxChange={handleBoundingBoxChange} />

      <div>
        <pre>{JSON.stringify(boundingBox, null, '\t')}</pre>
      </div>
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

const Container = styled.div`
  padding: 32px;
  min-width: 320px;
  max-width: 800px;
  min-height: 150vh;
`;

const MeasuredTextArea = Measured(styled.textarea`
  ${boxStyles};
`);
