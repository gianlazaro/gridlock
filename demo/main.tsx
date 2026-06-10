import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Masonry, type MasonryRenderItemArgs } from '../src';
import './styles.css';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

interface DemoItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

const colors = ['#d95d39', '#2f80ed', '#2a9d8f', '#f2b705', '#7b61ff', '#ef476f', '#3a86ff', '#6a994e'];

function createItems(count: number, start = 0): DemoItem[] {
  return Array.from({ length: count }, (_, offset) => {
    const id = start + offset;
    return {
      id,
      title: `Item ${id + 1}`,
      color: colors[id % colors.length]!,
      height: 130 + ((id * 37) % 220),
    };
  });
}

function DemoCard({ item, index }: MasonryRenderItemArgs<DemoItem>) {
  return (
    <article className="card" tabIndex={0} style={{ minHeight: item.height }}>
      <div className="swatch" style={{ backgroundColor: item.color }} />
      <strong>{item.title}</strong>
      <span>#{index.toString().padStart(4, '0')}</span>
    </article>
  );
}

function App() {
  const [items, setItems] = useState(() => createItems(50));
  const isLoadingMoreRef = useRef(false);
  const nextId = useMemo(() => Math.max(...items.map((item) => item.id), 0) + 1, [items]);
  const renderItem = useCallback((args: MasonryRenderItemArgs<DemoItem>) => <DemoCard {...args} />, []);
  const appendItems = useCallback(() => {
    if (isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    window.setTimeout(() => {
      setItems((current) => {
        const start = Math.max(...current.map((item) => item.id), 0) + 1;
        return [...current, ...createItems(100, start)];
      });
      isLoadingMoreRef.current = false;
    }, 120);
  }, []);

  return (
    <main>
      <header>
        <div>
          <h1>React Jotai Masonry</h1>
          <p>{items.length.toLocaleString()} variable-height items, infinite, bucketed, and virtualized.</p>
        </div>
        <div className="actions">
          <button onClick={() => setItems((current) => [...createItems(25, nextId), ...current])}>Insert 25</button>
          <button onClick={() => setItems((current) => current.slice(25))}>Delete 25</button>
          <button onClick={appendItems}>Append 100</button>
          <button onClick={() => setItems(createItems(50))}>Reset</button>
        </div>
      </header>

      <Masonry
        items={items}
        getItemKey={(item) => item.id}
        estimateItemHeight={(item) => item.height}
        minColumnWidth={190}
        gap={14}
        bucketSize={640}
        overscan={0}
        placement="balanced"
        endReachedMargin={240}
        onEndReached={appendItems}
        className="grid"
        itemClassName="cell"
      >
        {renderItem}
      </Masonry>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
