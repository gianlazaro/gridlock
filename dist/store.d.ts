import type { MasonryKey } from './types';
export declare const containerWidthAtom: import("jotai").PrimitiveAtom<number> & {
    init: number;
};
export declare const measuredHeightsAtom: import("jotai").PrimitiveAtom<Map<MasonryKey, number>> & {
    init: Map<MasonryKey, number>;
};
export declare const setMeasuredHeightAtom: import("jotai").WritableAtom<null, [update: {
    key: MasonryKey;
    height: number;
    epsilon?: number;
}], void> & {
    init: null;
};
export declare const pruneMeasuredHeightsAtom: import("jotai").WritableAtom<null, [keys: Iterable<MasonryKey>], void> & {
    init: null;
};
//# sourceMappingURL=store.d.ts.map