import { describe, expect, it } from 'vitest';
import { findScrollAnchor } from './scrollAnchor';
import type { MasonryItemPosition } from './types';

const positions: MasonryItemPosition[] = [
  { index: 0, key: 'a', column: 0, x: 0, y: 0, width: 100, height: 120 },
  { index: 1, key: 'b', column: 1, x: 110, y: 0, width: 100, height: 180 },
  { index: 2, key: 'c', column: 0, x: 0, y: 140, width: 100, height: 100 },
  { index: 3, key: 'd', column: 1, x: 110, y: 200, width: 100, height: 100 },
];

describe('findScrollAnchor', () => {
  it('selects the first item intersecting the anchor point in source order', () => {
    expect(findScrollAnchor(positions, 0)).toEqual({ key: 'a', y: 0, viewportOffset: 0 });
    expect(findScrollAnchor(positions, 150)).toEqual({ key: 'b', y: 0, viewportOffset: 0 });
    expect(findScrollAnchor(positions, 190)).toEqual({ key: 'c', y: 140, viewportOffset: 0 });
  });

  it('returns null when there are no positions', () => {
    expect(findScrollAnchor([], 100)).toBeNull();
  });
});
