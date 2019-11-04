import SyntaxHighlighter from 'react-syntax-highlighter';
// import { ocean } from 'react-syntax-highlighter/dist/styles/hljs';

import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Paragraph = styled.div`
  color: #818c8c;
  text-shadow: 0 0 5px #fff;
`;

export const ParagraphRight = styled(Paragraph)`
  text-align: right;
`;

export const Heading1 = styled.h1``;

export const Heading2 = styled.h2`
  color: #666;
`;

export const HorizontalContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > * + * {
    margin-left: 20px;
  }
`;

export const Button = styled.div`
  display: inline-block;
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  border-radius: 3px;
`;

export const boxStyles = css`
  width: 20vw;
  height: 20vw;
  min-width: 150px;
  min-height: 150px;
  padding: 8px;
  border: 5px dotted #ccc;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const CodeBlock = styled(SyntaxHighlighter).attrs({ language: 'jsx' })``;
