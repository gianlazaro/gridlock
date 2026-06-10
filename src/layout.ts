import type { MasonryItemPosition, MasonryLayout, MasonryLayoutOptions } from './types';

const clampPositive = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? value : fallback;

export function getColumnCount(width: number, minColumnWidth: number, gap: number, maxColumnCount?: number) {
  const safeWidth = clampPositive(width, 1);
  const safeMin = clampPositive(minColumnWidth, 1);
  const safeGap = Math.max(0, gap);
  const count = Math.max(1, Math.floor((safeWidth + safeGap) / (safeMin + safeGap)));
  return Math.max(1, Math.min(count, maxColumnCount ?? count));
}

function getShortestColumnIndex(columnHeights: readonly number[]) {
  let shortestIndex = 0;
  let shortestHeight = columnHeights[0] ?? 0;

  for (let index = 1; index < columnHeights.length; index += 1) {
    const height = columnHeights[index]!;
    if (height < shortestHeight) {
      shortestHeight = height;
      shortestIndex = index;
    }
  }

  return shortestIndex;
}

export function createMasonryLayout<TItem>({
  items,
  width,
  gap,
  minColumnWidth,
  getItemKey,
  estimateItemHeight,
  measuredHeights,
  maxColumnCount,
  placement = 'balanced',
}: MasonryLayoutOptions<TItem>): MasonryLayout {
  const columnCount = getColumnCount(width, minColumnWidth, gap, maxColumnCount);
  const safeGap = Math.max(0, gap);
  const columnWidth = Math.max(1, (Math.max(1, width) - safeGap * (columnCount - 1)) / columnCount);
  const columnHeights = Array.from({ length: columnCount }, () => 0);
  const positions: MasonryItemPosition[] = new Array(items.length);

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]!;
    const key = getItemKey(item, index);
    const measuredHeight = measuredHeights?.get(key);
    const estimatedHeight = estimateItemHeight(item, index, columnWidth);
    const height = Math.max(1, measuredHeight ?? estimatedHeight);
    const column = placement === 'balanced' ? getShortestColumnIndex(columnHeights) : index % columnCount;
    const x = column * (columnWidth + safeGap);
    const y = columnHeights[column]!;

    positions[index] = { index, key, column, x, y, width: columnWidth, height };
    columnHeights[column] = y + height + safeGap;
  }

  let height = 0;
  for (const columnHeight of columnHeights) {
    height = Math.max(height, columnHeight - safeGap);
  }

  return {
    columnCount,
    columnWidth,
    height: Math.max(0, height),
    positions,
  };
}
