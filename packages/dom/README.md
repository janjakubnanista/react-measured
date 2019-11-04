# react-bounding-box-dom

Zero-dependency `React` bounding box providers and hooks for DOM elements.

## Why `react-bounding-box-dom`?

Sometimes you need access to size and/or position of a component DOM element, typically:

- You are using a library such as `react-window`, `react-virtualized` or `react-vtree` and need numeric `width` and `height` in order to render your components
- You are rendering responsive charts (or WebGL)
- You are visually relating components that are unrelated in DOM
- You are implementing a component that changes its behavior depending on its size and/or position
- ...

In these cases you usually end up using some sort of stateful component logic based on the `resize` event of the `window` object. The problem with this solution is that your layout might change even though window dimensions haven't.

That is where `react-bounding-box-dom` comes in:

```JSX
import React from 'react';
import { BoundingBoxProvider } from 'react-bounding-box-dom';

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

`react-bounding-box-dom` is available as an NPM module (along with its TypeScript definitions):

```bash
# For npm users
npm install --save react-bounding-box-dom

# For yarn users
yarn add react-bounding-box-dom
```

<!-- FIXME -->
<a id="api"></a>
## API Documentation

### `BoundingBoxProvider`

```JSX
import { BoundingBoxProvider } from 'react-bounding-box-dom';
```

Probably the most interesting export - a component that gives you access to its bounding box.

This component renders a `div` element under the hood and passes all HTML attributes down to this element. Besides these it accepts the following props:

```TypeScript
interface BoundingBoxProviderProps {
  boundingBoxTransforms?: CheckerTransformInput[];
  // children?: BoundingBoxProviderChildrenFunction | React.ReactNode;
  // onBoundingBoxChange?: (props: BoundingBox | undefined) => void;
  positionOnly?: boolean;
  sizeOnly?: boolean;
}
```

#### children

`children?: ReactNode | (box: BoundingBox) => ReactNode`

Although `BoundingBoxProvider` can accept `ReactNode` as `children`, the default use case will most probably look like:

```JSX
const MyComponent = () => (
  <BoundingBoxProvider>
    {boundingBox => (
      <Chart width={boundingBox.width} height={boundingBox.height}>
    )}
  </BoundingBoxProvider>
)
```

In this case the `children` prop of `BoundingBoxProvider` is a render function that receives a single parameter, `boundingBox` (see <a href="#api/BoundingBox">`BoundingBox`</a> below).

#### onBoundingBoxChange

`onBoundingBoxChange?: (props: BoundingBox | undefined) => void`

In some cases you want to make the bounding box available to a parent component, then most probably store it in a component state somewhere. For this you can use the `onBoundingBoxChange` prop:

```JSX
const MyComponent = () => {
  const [boundingBox, setBoundingBox] = useState<BoundingBox>();
  const className = boundingBox && boundingBox.top < 0 ? "highlighted" : null

  <div>
    <BoundingBoxProvider onBoundingBoxChange={setBoundingBox}>
      ... Some children here, can also be a callback ...
    </BoundingBoxProvider>

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
  <BoundingBoxProvider positionOnly>
    {boundingBox => {
      // boundingBox will now have width & height set to NaN
    }}
  </BoundingBoxProvider>
)
```

In this case the `width` and `height` of the `boundingBox` (in both `children` and `onBoundingBoxChange` callback) will be set to `NaN`.

#### sizeOnly

`sizeOnly?: boolean`

If you are not interested in the element position and only want to rerender when the position changes you can pass truthy `sizeOnly`:

```JSX
const MyComponent = () => (
  <BoundingBoxProvider sizeOnly>
    {boundingBox => {
      // boundingBox will now have top, right, bottom and left set to NaN
    }}
  </BoundingBoxProvider>
)
```

In this case the `top`, `right`, `bottom` and `left` of the `boundingBox` (in both `children` and `onBoundingBoxChange` callback) will be set to `NaN`.

**IMPORTANT** For most of the use cases you want to turn `sizeOnly` on since you don't want to be rerendering your charts or lists whenever e.g. the user scrolls the page.

#### boundingBoxTransforms

`boundingBoxTransforms?: ((box: BoundingBox) => BoundingBox)[]`

This is an advanced use case prop for people that want to transform the bounding box measurements based on any external factors.

These functions will be executed in order, the result of each passed to the next one. The result of the transform chain is then used to determine whether the bounding box has changed.

**IMPORTANT** `sizeOnly` and `positionOnly` are internally implemented as such transforms and will be applied after your custom transforms.

`useBoundingBox`

```JSX
import { useBoundingBox } from 'react-bounding-box-dom';
```

<a id="api/BoundingBox"></a>
`BoundingBox`

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