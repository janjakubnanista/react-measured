# @react-width-height/dom

Zero-dependency `React` bounding box providers and hooks for DOM elements.

## Why `@react-width-height/dom`?

Sometimes you need access to size and/or position of a component DOM element, typically:

- You are using a library such as `react-window`, `react-virtualized` or `react-vtree` and need numeric `width` and `height` in order to render your components
- You are rendering responsive charts (or WebGL)
- You are visually relating components that are unrelated in DOM
- You are implementing a component that changes its behavior depending on its size and/or position
- ...

In these cases you usually end up using some sort of stateful component logic based on the `resize` event of the `window` object. The problem with this solution is that your layout might change even though window dimensions haven't.

That is where `@react-width-height/dom` comes in:

```JSX
import React from 'react';
import { BoundingBoxProvider } from '@react-width-height/dom';

const MyComponent: React.FC = () => (
  // BoundingBoxProvider accepts all valid <div/> props
  <BoundingBoxProvider style={{ ... }} className='...'>
    {box => (
      {/* Let's say you are rendering a Chart */}
      <Chart width={box.width} height={box.height} />
    )}
  </BoundingBoxProvider>
);
```

<a href="#api">Check out the API docs</a> to get started!

## Installation

`@react-width-height/dom` is available as an NPM module (along with its TypeScript definitions):

```bash
# For npm users
npm install --save @react-width-height/dom

# For yarn users
yarn add @react-width-height/dom
```

<!-- FIXME -->
<a id="api"></a>
## API Documentation

`BoundingBoxProvider`

```JSX
import { BoundingBoxProvider } from '@react-width-height/dom';
```

`useBoundingBox`

```JSX
import { useBoundingBox } from '@react-width-height/dom';
```
