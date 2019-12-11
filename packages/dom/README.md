# react-measured-dom

[![Build Status](https://travis-ci.org/janjakubnanista/react-measured.svg?branch=master)](https://travis-ci.org/janjakubnanista/react-measured)

Zero-dependency `React` bounding box providers and hooks for DOM elements.

## Why `react-measured-dom`?

Sometimes you need access to size and/or position of a component DOM element, typically:

- You are using a library such as `react-window`, `react-virtualized` or `react-vtree` and need numeric `width` and `height` in order to render your components
- You are rendering responsive charts (or WebGL)
- You are visually relating components that are unrelated in DOM
- You are implementing a component that changes its behavior depending on its size and/or position
- ...

In these cases you usually end up using some sort of stateful component logic based on the `resize` event of the `window` object. The problem with this solution is that your layout might change even though window dimensions haven't.

That is where `react-measured-dom` comes in!

## In this guide

- <a href="#installation">Installation</a>
- <a href="#api">API Docs</a>
  - <a href="#api/Measured">`Measured`</a>
    - <a href="#api/Measured/DOM">`Measured` for DOM nodes</a>
    - <a href="#api/Measured/HOC">`Measured` as HOC</a>
    - <a href="#api/Measured/styled-components">`Measured` with `styled-components`</a>
    - <a href="#api/Measured/props">`Measured` element props</a>
  - <a href="#api/useBoundingBox">`useBoundingBox`</a>
    - <a href="#api/useBoundingBox/basic">`useBoundingBox` basic API</a>
    - <a href="#api/useBoundingBox/transforms">`useBoundingBox` transforms</a>
  - <a href="#api/BoundingBox">`BoudingBox`</a>

### Quick example

```JSX
import React from 'react';
import { Measured } from 'react-measured-dom';

const MyComponent: React.FC = () => (
  <Measured.div className='full-size'>
    {box => (
      {/* Let's say you are rendering a Chart */}
      <Chart width={box.width} height={box.height} />
    )}
  </Measured.div>
);
```

<a href="#api">Check out the API docs</a> to get started!

<a id="installation"></a>
## Installation

`react-measured-dom` is available as an NPM module (along with its TypeScript definitions):

```bash
# For npm users
npm install --save react-measured-dom

# For yarn users
yarn add react-measured-dom
```

<!-- FIXME -->
<a id="api"></a>
## API Documentation

<a id="api/Measured"></a>
### `Measured`

```JSX
import { Measured } from 'react-measured-dom';
```

<a id="api/Measured/DOM"></a>
#### Using predefined DOM elements

Probably the most interesting export that gives you instant access to all pre-wrapped HTML elements:

```JSX
import React from 'react';
import { Measured } from 'react-measured-dom';

const MyComponent: React.FC = () => (
  <>
    <Measured.div />
    <Measured.span />
    <Measured.em />
    <Measured.aside />
    {/* See below for all supported elements */}
  </>
);
```

`Measured` exposes the following HTML elements:

`a`, `abbr`, `address`, `article`, `aside`, `b`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `button`, `canvas`, `caption`, `cite`, `code`, `dd`, `del`, `details`, `dfn`, `dialog`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `footer`, `form`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hgroup`, `hr`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `main`, `map`, `mark`, `meter`, `nav`, `object`, `ol`, `output`, `p`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `section`, `select`, `small`, `span`, `strong`, `sub`, `summary`, `sup`, `table`, `tbody`, `td`, `textarea`, `tfoot`, `th`, `thead`, `time`, `tr`, `u`, `ul`, `var`, `video`,

<a id="api/Measured/HOC"></a>
#### Using Measured as HOC

If these are not enough (for example you want to wrap an existing component for measurements) you can go the HOC way:

```JSX
import React from 'react';
import Label from '../your/label/component';
import { Measured } from 'react-measured-dom';

const MeasuredLabel = Measured(Label);

const MyComponent: React.FC = () => (
  // MeasuredLabel component accepts all the original props from Label
  <MeasuredLabel someLabelProp="value">
    {box => {
      // Use the bounding box here
    }}
  </MeasuredLabel>
);
```

**IMPORTANT** The `ref` of the wrapped element must be a ref to a `HTMLElement`!

<a id="api/Measured/styled-components"></a>
#### Using Measured with `styled-components`

Since `react-measured-dom`'s only requirement is for the wrapped element to expose a `ref` containing an `HTMLElement`, it is possible to use it in conjunction with `styled-components` as well:

```JSX
import React from 'react';
import styled from 'styled-components';
import { Measured } from 'react-measured-dom';

const StyledComponent = styled.div`
  ...
`;

const MeasuredStyledComponent = Measured(StyledComponent);

const MyComponent: React.FC = () => (
  <MeasuredStyledComponent>
    {box => {
      // Use the bounding box here
    }}
  </MeasuredStyledComponent>
);
```

<a id="api/Measured/props"></a>
Besides the props of the wrapped element, `Measured` accepts the following props:

#### children

`children?: ReactNode | (box: BoundingBox) => ReactNode`

Although `Measured.div` can accept `ReactNode` as `children`, the default use case will most probably look like:

```JSX
const MyComponent = () => (
  <Measured.div>
    {boundingBox => (
      <Chart width={boundingBox.width} height={boundingBox.height}>
    )}
  </Measured.div>
)
```

In this case the `children` prop of `Measured.div` is a render function that receives a single parameter, `boundingBox` (see <a href="#api/BoundingBox">`BoundingBox`</a> below).

#### onBoundingBoxChange

`onBoundingBoxChange?: (props: BoundingBox | undefined) => void`

In some cases you want to make the bounding box available to a parent component, then most probably store it in a component state somewhere. For this you can use the `onBoundingBoxChange` prop:

```JSX
const MyComponent = () => {
  const [boundingBox, setBoundingBox] = useState<BoundingBox>();
  const className = boundingBox && boundingBox.top < 0 ? "highlighted" : null

  <div>
    <Measured.div onBoundingBoxChange={setBoundingBox}>
      ... Some children here, can also be a callback ...
    </Measured.div>

    <div className={className}>
      And the bounding box gets used somewhere else
    </div>
  </div>
}
```

This prop gets called everytime the bounding box changes. When the component unmounts it gets called with `undefined`.

#### positionOnly

`positionOnly?: boolean`

If you are not interested in the element dimensions and only want to rerender when the position changes you can pass truthy `positionOnly`:

```JSX
const MyComponent = () => (
  <Measured.div positionOnly>
    {boundingBox => {
      // boundingBox will now have width & height set to NaN
    }}
  </Measured.div>
)
```

In this case the `width` and `height` of the `boundingBox` (in both `children` and `onBoundingBoxChange` callback) will be set to `NaN`.

#### sizeOnly

`sizeOnly?: boolean`

If you are not interested in the element position and only want to rerender when the position changes you can pass truthy `sizeOnly`:

```JSX
const MyComponent = () => (
  <Measured.div sizeOnly>
    {boundingBox => {
      // boundingBox will now have top, right, bottom and left set to NaN
    }}
  </Measured.div>
)
```

In this case the `top`, `right`, `bottom` and `left` of the `boundingBox` (in both `children` and `onBoundingBoxChange` callback) will be set to `NaN`.

**IMPORTANT** For most of the use cases you want to turn `sizeOnly` on since you don't want to be rerendering your charts or lists whenever e.g. the user scrolls the page.

<a id="api/useBoundingBox"></a>
### `useBoundingBox`

```JSX
import { useBoundingBox } from 'react-measured-dom';
```

Sometimes you just want a more fine grained access to `react-measured-dom` capabilities. In those cases you can skip the HOC approach and measure a `ref` to an `HTMLElement` using `useBoundingBox`:

```JSX
const MyComponent = () => {
  const ref = useRef<HTMLElement>();
  const boundingBox: BoundingBox | undefined = useBoundingBox(ref);

  // You can either use the boudingBox here or pass it around
  // just remember, on the first render it is going to be `undefined`

  return <div ref={ref}>
    {/* ... */}
  </div>
}
```

<a id="api/useBoundingBox/basic"></a>
#### Basic API

```TypeScript
useBoundingBox: (
  ref: React.RefObject<HTMLElement>,
  onChange?: (box: BoundingBox | undefined) => void,
)
```

<a id="api/useBoundingBox/transforms"></a>
#### Using transforms

Sometimes you might want to tweak the measured size/position values depending on external factors (e.g. to discard size or position in order to optimise rendering). For that you can pass an array of transforms applied to the original measured `BoundingBox`.

```TypeScript
// For ease of use falsy values are also allowed
type CheckerTransform = (box: BoundingBox) => BoundingBox;

useBoundingBox: (
  ref: React.RefObject<HTMLElement>,
  onChange?: (box: BoundingBox | undefined) => void,
  transform?: CheckerTransform
) => BoundingBox
```

These will be applied left to right, the return value of one passed to the next.

<a id="api/BoundingBox"></a>
### `BoundingBox`

A data container for information about a bounding box. Looks like:

```TypeScript
interface BoundingBox {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}
```

**IMPORTANT** `top`, `right`, `bottom` and `left` are all measured from the left top corner of the reference element, they do not act like e.g. CSS `bottom` or `right` values that are measured relative to the bottom edge of the container.

## Issues

Please use [the github issue tracker](https://github.com/janjakubnanista/react-measured/issues) to submit any bugs or feature requests.