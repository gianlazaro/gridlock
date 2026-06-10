import type { MasonryItemPosition, SpatialHashOptions } from './types';
export interface SpatialHash {
    bucketSize: number;
    bucketCount: number;
    buckets: Map<number, number[]>;
    query: (start: number, end: number) => number[];
}
export declare function createSpatialHash(positions: readonly MasonryItemPosition[], options: SpatialHashOptions): SpatialHash;
//# sourceMappingURL=spatialHash.d.ts.map