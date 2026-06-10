import { Provider } from 'jotai';
import { createElement, memo, useCallback, useMemo, useState } from 'react';
import { MasonryItem } from './MasonryItem';
import { useStableScrollAnchor } from './scrollAnchor';
import { useMasonry } from './useMasonry';
import { useRafContainerWidth } from './useRafMeasure';
import type { MasonryProps } from './types';

function MasonryContent<TItem>({
  as = 'div',
  className,
  style,
  itemClassName,
  itemStyle,
  children,
  renderItem,
  role = 'list',
  initialWidth = 0,
  maintainScrollPosition = true,
  items,
  bucketSize,
  gap,
  minColumnWidth,
  getItemKey,
  estimateItemHeight,
  maxColumnCount,
  placement,
  overscan = 0,
  scrollMargin,
  onEndReached,
  endReachedMargin,
}: MasonryProps<TItem>) {
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);
  const setContainerRef = useCallback((element: HTMLElement | null) => {
    setContainerElement(element);
  }, []);
  useRafContainerWidth(containerElement, initialWidth);
  const render = children ?? renderItem;

  const masonryOptions = useMemo(
    () => ({
      items,
      bucketSize,
      gap,
      minColumnWidth,
      getItemKey,
      estimateItemHeight,
      maxColumnCount,
      placement,
      overscan,
      scrollMargin,
      initialWidth,
      onEndReached,
      endReachedMargin,
    }),
    [
      items,
      bucketSize,
      gap,
      minColumnWidth,
      getItemKey,
      estimateItemHeight,
      maxColumnCount,
      placement,
      overscan,
      scrollMargin,
      initialWidth,
      onEndReached,
      endReachedMargin,
    ],
  );
  const masonry = useMasonry(masonryOptions);
  useStableScrollAnchor(containerElement, masonry.layout, maintainScrollPosition);

  const containerStyle = useMemo(
    () => ({
      position: 'relative' as const,
      width: '100%',
      height: masonry.layout.height,
      overflowAnchor: 'none' as const,
      ...style,
    }),
    [masonry.layout.height, style],
  );

  const renderedItems = useMemo(
    () =>
      masonry.visibleIndexes.map((index) => {
        const position = masonry.layout.positions[index];
        const item = items[index];
        if (!position || item === undefined) return null;

        return (
          <MasonryItem
            key={position.key}
            item={item}
            index={index}
            position={position}
            isMeasured={masonry.measuredHeights.has(position.key)}
            className={itemClassName}
            itemStyle={itemStyle}
            renderItem={render}
          />
        );
      }),
    [
      items,
      itemClassName,
      itemStyle,
      masonry.layout.positions,
      masonry.measuredHeights,
      masonry.visibleIndexes,
      render,
    ],
  );

  return createElement(
    as,
    {
      ref: setContainerRef,
      className,
      role,
      style: containerStyle,
    },
    renderedItems,
  );
}

function MasonryInner<TItem>(props: MasonryProps<TItem>) {
  return (
    <Provider>
      <MasonryContent {...props} />
    </Provider>
  );
}

export const Masonry = memo(MasonryInner) as typeof MasonryInner;
