import { type CSSProperties } from 'react';
import type { MasonryItemPosition, MasonryRenderItem, MasonryRenderItemArgs } from './types';
interface MasonryItemProps<TItem> {
    item: TItem;
    index: number;
    position: MasonryItemPosition;
    isMeasured: boolean;
    className?: string | ((args: MasonryRenderItemArgs<TItem>) => string | undefined);
    itemStyle?: CSSProperties | ((args: MasonryRenderItemArgs<TItem>) => CSSProperties | undefined);
    renderItem: MasonryRenderItem<TItem>;
}
declare function MasonryItemInner<TItem>({ item, index, position, isMeasured, className, itemStyle, renderItem, }: MasonryItemProps<TItem>): import("react").JSX.Element;
export declare const MasonryItem: typeof MasonryItemInner;
export {};
//# sourceMappingURL=MasonryItem.d.ts.map