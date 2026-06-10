import type { UseMasonryOptions } from './types';
export declare function useMasonry<TItem>(options: UseMasonryOptions<TItem>): {
    layout: import("./types").MasonryLayout;
    spatialHash: import("./spatialHash").SpatialHash;
    visibleIndexes: number[];
    rowVirtualizer: import("@tanstack/react-virtual").ReactVirtualizer<Window, Element>;
    width: number;
    measuredHeights: Map<import("./types").MasonryKey, number>;
};
//# sourceMappingURL=useMasonry.d.ts.map