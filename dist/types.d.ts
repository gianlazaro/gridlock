import type { CSSProperties, ElementType, ReactNode } from 'react';
export type MasonryKey = string | number;
export type MasonryPlacement = 'ordered' | 'balanced';
export interface MasonryItemPosition {
    index: number;
    key: MasonryKey;
    column: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface MasonryLayout {
    columnCount: number;
    columnWidth: number;
    height: number;
    positions: MasonryItemPosition[];
}
export interface MasonryLayoutOptions<TItem> {
    items: readonly TItem[];
    width: number;
    gap: number;
    minColumnWidth: number;
    getItemKey: (item: TItem, index: number) => MasonryKey;
    estimateItemHeight: (item: TItem, index: number, columnWidth: number) => number;
    measuredHeights?: ReadonlyMap<MasonryKey, number>;
    maxColumnCount?: number;
    placement?: MasonryPlacement;
}
export interface SpatialHashOptions {
    bucketSize: number;
    contentHeight: number;
}
export interface MasonryRenderItemArgs<TItem> {
    item: TItem;
    index: number;
    isMeasured: boolean;
    position: MasonryItemPosition;
}
export type MasonryRenderItem<TItem> = (args: MasonryRenderItemArgs<TItem>) => ReactNode;
export interface UseMasonryOptions<TItem> extends Omit<MasonryLayoutOptions<TItem>, 'width'> {
    bucketSize?: number;
    overscan?: number;
    scrollMargin?: number;
    initialWidth?: number;
    maintainScrollPosition?: boolean;
    onEndReached?: () => void;
    endReachedMargin?: number;
}
interface MasonryBaseProps<TItem> extends UseMasonryOptions<TItem> {
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    itemClassName?: string | ((args: MasonryRenderItemArgs<TItem>) => string | undefined);
    itemStyle?: CSSProperties | ((args: MasonryRenderItemArgs<TItem>) => CSSProperties | undefined);
    role?: string;
}
export type MasonryProps<TItem> = MasonryBaseProps<TItem> & ({
    children: MasonryRenderItem<TItem>;
    renderItem?: never;
} | {
    children?: never;
    renderItem: MasonryRenderItem<TItem>;
});
export {};
//# sourceMappingURL=types.d.ts.map