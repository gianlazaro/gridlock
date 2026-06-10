import { defaultRangeExtractor, useWindowVirtualizer } from '@tanstack/react-virtual';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { containerWidthAtom, measuredHeightsAtom, pruneMeasuredHeightsAtom } from './store';
import { createMasonryLayout } from './layout';
import { createSpatialHash } from './spatialHash';
import type { UseMasonryOptions } from './types';

export function useMasonry<TItem>(options: UseMasonryOptions<TItem>) {
  const {
    items,
    bucketSize = 600,
    gap,
    minColumnWidth,
    getItemKey,
    estimateItemHeight,
    maxColumnCount,
    placement,
    overscan = 1,
    scrollMargin = 0,
    initialWidth,
    onEndReached,
    endReachedMargin = bucketSize * 2,
  } = options;
  const width = useAtomValue(containerWidthAtom) || initialWidth || 0;
  const measuredHeights = useAtomValue(measuredHeightsAtom);
  const pruneMeasuredHeights = useSetAtom(pruneMeasuredHeightsAtom);
  const wasNearEndRef = useRef(false);
  const itemKeys = useMemo(() => items.map(getItemKey), [getItemKey, items]);

  useEffect(() => {
    pruneMeasuredHeights(itemKeys);
  }, [itemKeys, pruneMeasuredHeights]);

  const layout = useMemo(
    () =>
      createMasonryLayout({
        items,
        width,
        gap,
        minColumnWidth,
        getItemKey,
        estimateItemHeight,
        measuredHeights,
        maxColumnCount,
        placement,
      }),
    [items, width, gap, minColumnWidth, getItemKey, estimateItemHeight, measuredHeights, maxColumnCount, placement],
  );

  const spatialHash = useMemo(
    () => createSpatialHash(layout.positions, { bucketSize, contentHeight: Math.max(layout.height, bucketSize) }),
    [bucketSize, layout.height, layout.positions],
  );
  const estimateBucketSize = useCallback(() => spatialHash.bucketSize, [spatialHash.bucketSize]);

  const rowVirtualizer = useWindowVirtualizer({
    count: Math.max(1, Math.ceil(layout.height / spatialHash.bucketSize)),
    estimateSize: estimateBucketSize,
    overscan,
    scrollMargin,
    rangeExtractor: defaultRangeExtractor,
  });

  const virtualBuckets = rowVirtualizer.getVirtualItems();
  const visibleRange = useMemo(() => {
    if (virtualBuckets.length === 0) return { start: 0, end: spatialHash.bucketSize };
    const start = virtualBuckets[0]!.start;
    const last = virtualBuckets[virtualBuckets.length - 1]!;
    return { start, end: last.end };
  }, [spatialHash.bucketSize, virtualBuckets]);

  const visibleIndexes = useMemo(
    () => spatialHash.query(visibleRange.start, visibleRange.end),
    [spatialHash, visibleRange.end, visibleRange.start],
  );
  const viewportEnd =
    typeof window === 'undefined'
      ? visibleRange.end
      : window.scrollY + window.innerHeight - scrollMargin;

  useEffect(() => {
    if (!onEndReached || items.length === 0) return undefined;
    const isNearEnd = viewportEnd >= layout.height - endReachedMargin;

    if (!isNearEnd) {
      wasNearEndRef.current = false;
      return undefined;
    }

    if (wasNearEndRef.current) return undefined;

    wasNearEndRef.current = true;
    let didFire = false;
    const notifyEndReached = () => {
      didFire = true;
      onEndReached();
    };
    const frame =
      typeof requestAnimationFrame === 'undefined'
        ? window.setTimeout(notifyEndReached, 0)
        : requestAnimationFrame(notifyEndReached);

    return () => {
      if (!didFire) wasNearEndRef.current = false;
      if (typeof cancelAnimationFrame === 'undefined') {
        window.clearTimeout(frame);
      } else {
        cancelAnimationFrame(frame);
      }
    };
  }, [endReachedMargin, items.length, layout.height, onEndReached, viewportEnd]);

  return {
    layout,
    spatialHash,
    visibleIndexes,
    rowVirtualizer,
    width,
    measuredHeights,
  };
}
