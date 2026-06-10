import { describe, expect, it } from 'vitest';
import { createMasonryLayout, getColumnCount } from './layout';

interface Item {
  id: string;
  height: number;
}

const items: Item[] = [
  { id: 'a', height: 100 },
  { id: 'b', height: 140 },
  { id: 'c', height: 180 },
  { id: 'd', height: 120 },
  { id: 'e', height: 160 },
];

describe('createMasonryLayout', () => {
  it('computes responsive column counts', () => {
    expect(getColumnCount(640, 200, 16)).toBe(3);
    expect(getColumnCount(120, 200, 16)).toBe(1);
    expect(getColumnCount(1200, 180, 12, 4)).toBe(4);
  });

  it('balances columns by default', () => {
    const unbalancedItems: Item[] = [
      { id: 'a', height: 300 },
      { id: 'b', height: 100 },
      { id: 'c', height: 100 },
      { id: 'd', height: 100 },
    ];
    const layout = createMasonryLayout({
      items: unbalancedItems,
      width: 640,
      gap: 20,
      minColumnWidth: 200,
      getItemKey: (item) => item.id,
      estimateItemHeight: (item) => item.height,
    });

    expect(layout.positions.map((position) => position.column)).toEqual([0, 1, 2, 1]);
  });

  it('can place items left-to-right for source-order priority', () => {
    const layout = createMasonryLayout({
      items,
      width: 640,
      gap: 20,
      minColumnWidth: 200,
      getItemKey: (item) => item.id,
      estimateItemHeight: (item) => item.height,
      placement: 'ordered',
    });

    expect(layout.columnCount).toBe(3);
    expect(layout.positions.map((position) => position.column)).toEqual([0, 1, 2, 0, 1]);
    expect(layout.positions.map((position) => position.index)).toEqual([0, 1, 2, 3, 4]);
    expect(layout.positions[3]!.y).toBe(120);
    expect(layout.positions[4]!.y).toBe(160);
  });

  it('uses measured heights when available', () => {
    const measured = new Map<string, number>([['a', 250]]);
    const layout = createMasonryLayout({
      items,
      width: 430,
      gap: 10,
      minColumnWidth: 200,
      getItemKey: (item) => item.id,
      estimateItemHeight: (item) => item.height,
      measuredHeights: measured,
    });

    expect(layout.positions[0]!.height).toBe(250);
    expect(layout.positions[2]!.y).toBe(150);
  });
});
