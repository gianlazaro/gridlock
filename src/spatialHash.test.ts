import { describe, expect, it } from 'vitest';
import { createSpatialHash } from './spatialHash';
import type { MasonryItemPosition } from './types';

const positions: MasonryItemPosition[] = [
  { index: 0, key: 0, column: 0, x: 0, y: 0, width: 100, height: 100 },
  { index: 1, key: 1, column: 1, x: 110, y: 30, width: 100, height: 220 },
  { index: 2, key: 2, column: 0, x: 0, y: 130, width: 100, height: 80 },
  { index: 3, key: 3, column: 1, x: 110, y: 280, width: 100, height: 90 },
];

describe('createSpatialHash', () => {
  it('buckets items by vertical regions and dedupes query results', () => {
    const hash = createSpatialHash(positions, { bucketSize: 100, contentHeight: 400 });

    expect(hash.query(0, 99)).toEqual([0, 1]);
    expect(hash.query(100, 199)).toEqual([0, 1, 2]);
    expect(hash.query(260, 399)).toEqual([3]);
  });

  it('keeps query results sorted when items span multiple buckets', () => {
    const hash = createSpatialHash(
      [
        { index: 0, key: 0, column: 0, x: 0, y: 190, width: 100, height: 20 },
        { index: 1, key: 1, column: 0, x: 0, y: 0, width: 100, height: 250 },
        { index: 2, key: 2, column: 0, x: 0, y: 210, width: 100, height: 20 },
      ],
      { bucketSize: 100, contentHeight: 300 },
    );

    expect(hash.query(200, 220)).toEqual([0, 1, 2]);
  });
});
