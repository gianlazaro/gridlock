import type { MasonryLayout, MasonryLayoutOptions } from './types';
export declare function getColumnCount(width: number, minColumnWidth: number, gap: number, maxColumnCount?: number): number;
export declare function createMasonryLayout<TItem>({ items, width, gap, minColumnWidth, getItemKey, estimateItemHeight, measuredHeights, maxColumnCount, placement, }: MasonryLayoutOptions<TItem>): MasonryLayout;
//# sourceMappingURL=layout.d.ts.map