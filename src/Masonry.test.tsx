import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Masonry } from './Masonry';

interface Item {
  id: number;
  height: number;
}

describe('Masonry', () => {
  it('renders a virtualized subset in source order with SSR-safe initial width', () => {
    const items: Item[] = Array.from({ length: 50 }, (_, id) => ({ id, height: 120 + (id % 5) * 20 }));

    render(
      <Masonry
        items={items}
        getItemKey={(item) => item.id}
        estimateItemHeight={(item) => item.height}
        minColumnWidth={160}
        initialWidth={500}
        gap={10}
        bucketSize={300}
      >
        {({ item }) => <div>{`Card ${item.id}`}</div>}
      </Masonry>,
    );

    expect(screen.getByText('Card 0')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.queryByText('Card 49')).not.toBeInTheDocument();
  });

  it('calls onEndReached when the virtual range reaches the end margin', async () => {
    const onEndReached = vi.fn();
    const items: Item[] = Array.from({ length: 3 }, (_, id) => ({ id, height: 100 }));

    render(
      <Masonry
        items={items}
        getItemKey={(item) => item.id}
        estimateItemHeight={(item) => item.height}
        minColumnWidth={160}
        initialWidth={500}
        gap={10}
        bucketSize={300}
        endReachedMargin={500}
        onEndReached={onEndReached}
        renderItem={({ item }) => <div>{`Card ${item.id}`}</div>}
      />,
    );

    await waitFor(() => expect(onEndReached).toHaveBeenCalledTimes(1));
  });

  it('supports renderItem for backwards compatibility', () => {
    const items: Item[] = [{ id: 1, height: 120 }];

    render(
      <Masonry
        items={items}
        getItemKey={(item) => item.id}
        estimateItemHeight={(item) => item.height}
        minColumnWidth={160}
        initialWidth={500}
        gap={10}
        renderItem={({ item }) => <div>{`Card ${item.id}`}</div>}
      />,
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
  });
});
