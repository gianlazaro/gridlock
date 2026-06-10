import type { MasonryItemPosition, SpatialHashOptions } from './types';

export interface SpatialHash {
  bucketSize: number;
  bucketCount: number;
  buckets: Map<number, number[]>;
  query: (start: number, end: number) => number[];
}

export function createSpatialHash(positions: readonly MasonryItemPosition[], options: SpatialHashOptions): SpatialHash {
  const bucketSize = Math.max(1, options.bucketSize);
  const buckets = new Map<number, number[]>();
  let highestBucket = 0;
  const seenQueryIds = new Uint32Array(positions.length);
  let queryId = 0;

  for (const position of positions) {
    const firstBucket = Math.floor(position.y / bucketSize);
    const lastBucket = Math.floor((position.y + position.height) / bucketSize);
    highestBucket = Math.max(highestBucket, lastBucket);

    for (let bucket = firstBucket; bucket <= lastBucket; bucket += 1) {
      const bucketItems = buckets.get(bucket);
      if (bucketItems) {
        bucketItems.push(position.index);
      } else {
        buckets.set(bucket, [position.index]);
      }
    }
  }

  const bucketCount = Math.max(1, Math.ceil(options.contentHeight / bucketSize), highestBucket + 1);

  return {
    bucketSize,
    bucketCount,
    buckets,
    query(start: number, end: number) {
      queryId = queryId === 0xffffffff ? 1 : queryId + 1;
      if (queryId === 1) seenQueryIds.fill(0);

      const firstBucket = Math.floor(Math.max(0, start) / bucketSize);
      const lastBucket = Math.floor(Math.max(start, end) / bucketSize);
      const result: number[] = [];

      for (let bucket = firstBucket; bucket <= lastBucket; bucket += 1) {
        const bucketItems = buckets.get(bucket);
        if (!bucketItems) continue;
        for (const index of bucketItems) {
          if (seenQueryIds[index] === queryId) continue;
          const position = positions[index];
          if (!position) continue;
          if (position.y <= end && position.y + position.height >= start) {
            seenQueryIds[index] = queryId;
            result.push(index);
          }
        }
      }

      return result.sort((a, b) => a - b);
    },
  };
}
