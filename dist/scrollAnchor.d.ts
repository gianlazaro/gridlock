import type { MasonryItemPosition, MasonryKey, MasonryLayout } from './types';
interface ScrollAnchorSnapshot {
    key: MasonryKey;
    y: number;
    viewportOffset: number;
}
export declare function findScrollAnchor(positions: readonly MasonryItemPosition[], anchorY: number): ScrollAnchorSnapshot | null;
export declare function useStableScrollAnchor(container: HTMLElement | null, layout: MasonryLayout, enabled?: boolean): void;
export {};
//# sourceMappingURL=scrollAnchor.d.ts.map