# Gridlock Masonry

A virtualized masonry library for React. By default, it prefers balanced, ordered grids. This prevents one column to be "heavier" than the rest of the columns. For some use cases, solely ordered grids can be enabled. 

## Features

- Pinterest-style responsive masonry with variable-height items
- Absolute-positioned items with virtualized rendering
- Spatial hashing by vertical viewport buckets
- TanStack Virtual viewport tracking
- Insertions, deletions, and resize-aware relayout
- Infinite scrolling with `onEndReached`
- Stable scroll anchoring when items above the viewport are inserted, removed, or remeasured

## Install

```bash
pnpm add gridlock-masonry
```

## Usage

```tsx
import { Masonry } from 'gridlock-masonry';

type Pin = {
  id: string;
  title: string;
  estimatedHeight: number;
};

export function Pins({ pins }: { pins: Pin[] }) {
  return (
    <Masonry
      items={pins}
      getItemKey={(pin) => pin.id}
      estimateItemHeight={(pin) => pin.estimatedHeight}
      minColumnWidth={220}
      gap={16}
      bucketSize={700}
      overscan={2}
      onEndReached={() => loadMorePins()}
    >
      {({ item }) => (
        <article tabIndex={0}>
          <h2>{item.title}</h2>
        </article>
      )}
    </Masonry>
  );
}
```

## API

### `<Masonry />`

Important props:

- `items`: your typed item array
- `getItemKey`: stable key getter
- `estimateItemHeight`: height estimate used until the real DOM height is measured
- `minColumnWidth`: responsive column target
- `gap`: spacing between items
- `bucketSize`: vertical spatial hash bucket size in pixels. A good default is 600-800.
- `overscan`: extra TanStack Virtual buckets rendered before and after the viewport
- `onEndReached`: called when the virtual range approaches the end of the masonry content
- `endReachedMargin`: distance in pixels from the end before `onEndReached` fires
- `placement`: `balanced` by default, or `ordered` for left-to-right source-order placement
- `maintainScrollPosition`: enabled by default; keeps the same visible item anchored when layout changes above it
- `children`: render callback with `{ item, index, position, isMeasured }`
- `renderItem`: equivalent callback prop kept for compatibility

### Hooks and Utilities

The package also exports `useMasonry`, `useItemMeasurement`, `createMasonryLayout`, `createSpatialHash`, and the Jotai atoms for advanced composition.

## Demo

```bash
pnpm install
pnpm dev
```

## Test and Build

```bash
pnpm test
pnpm build
```
