import { memo, useMemo, type CSSProperties } from 'react';
import { useItemMeasurement } from './useItemMeasurement';
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

function MasonryItemInner<TItem>({
  item,
  index,
  position,
  isMeasured,
  className,
  itemStyle,
  renderItem,
}: MasonryItemProps<TItem>) {
  const measureRef = useItemMeasurement(position.key);
  const args = useMemo(() => ({ item, index, position, isMeasured }), [item, index, position, isMeasured]);
  const resolvedClassName = useMemo(
    () => (typeof className === 'function' ? className(args) : className),
    [args, className],
  );
  const resolvedStyle = useMemo(
    () => (typeof itemStyle === 'function' ? itemStyle(args) : itemStyle),
    [args, itemStyle],
  );
  const style = useMemo(
    () => ({
      position: 'absolute' as const,
      left: 0,
      top: 0,
      width: position.width,
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      contain: 'layout paint style' as const,
      contentVisibility: 'auto' as const,
      ...resolvedStyle,
    }),
    [position.width, position.x, position.y, resolvedStyle],
  );

  return (
    <div
      ref={measureRef}
      className={resolvedClassName}
      data-masonry-index={index}
      role="listitem"
      style={style}
    >
      {renderItem(args)}
    </div>
  );
}

export const MasonryItem = memo(MasonryItemInner) as typeof MasonryItemInner;
