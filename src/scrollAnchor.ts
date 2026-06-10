import { useLayoutEffect, useRef } from 'react';
import type { MasonryItemPosition, MasonryKey, MasonryLayout } from './types';

interface ScrollAnchorSnapshot {
  key: MasonryKey;
  y: number;
  viewportOffset: number;
}

const useIsoLayoutEffect = typeof window === 'undefined' ? () => undefined : useLayoutEffect;

function getWindowScrollY() {
  return typeof window === 'undefined' ? 0 : window.scrollY || window.pageYOffset || 0;
}

function getContainerDocumentY(element: HTMLElement | null) {
  if (!element || typeof window === 'undefined') return 0;
  return element.getBoundingClientRect().top + getWindowScrollY();
}

function getViewportAnchorY() {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight * 0.35;
}

export function findScrollAnchor(
  positions: readonly MasonryItemPosition[],
  anchorY: number,
): ScrollAnchorSnapshot | null {
  let nextPosition: MasonryItemPosition | null = null;

  for (const position of positions) {
    if (position.y <= anchorY && position.y + position.height >= anchorY) {
      return { key: position.key, y: position.y, viewportOffset: 0 };
    }

    if (position.y > anchorY) {
      if (!nextPosition || position.y < nextPosition.y || (position.y === nextPosition.y && position.index < nextPosition.index)) {
        nextPosition = position;
      }
    }
  }

  return nextPosition ? { key: nextPosition.key, y: nextPosition.y, viewportOffset: 0 } : null;
}

export function useStableScrollAnchor(
  container: HTMLElement | null,
  layout: MasonryLayout,
  enabled = true,
) {
  const previousAnchorRef = useRef<ScrollAnchorSnapshot | null>(null);
  const layoutRef = useRef(layout);
  const frameRef = useRef(0);

  const updateAnchorSnapshot = () => {
    const containerTop = getContainerDocumentY(container);
    const viewportAnchorY = getViewportAnchorY();
    const renderedElements = container
      ? Array.from(container.querySelectorAll<HTMLElement>('[data-masonry-index]'))
      : [];
    const renderedAnchor = renderedElements.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top <= viewportAnchorY && rect.bottom >= viewportAnchorY;
    });

    if (renderedAnchor) {
      const index = Number(renderedAnchor.dataset.masonryIndex);
      const position = layoutRef.current.positions[index];
      if (position) {
        previousAnchorRef.current = {
          key: position.key,
          y: position.y,
          viewportOffset: renderedAnchor.getBoundingClientRect().top,
        };
        return;
      }
    }

    const anchorY = Math.max(0, getWindowScrollY() + getViewportAnchorY() - containerTop);
    const anchor = findScrollAnchor(layoutRef.current.positions, anchorY);
    previousAnchorRef.current = anchor
      ? {
          ...anchor,
          viewportOffset: containerTop + anchor.y - getWindowScrollY(),
        }
      : null;
  };

  useIsoLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useIsoLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      previousAnchorRef.current = null;
      return undefined;
    }

    const scheduleAnchorSnapshot = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(updateAnchorSnapshot);
    };

    updateAnchorSnapshot();
    window.addEventListener('scroll', scheduleAnchorSnapshot, { passive: true, capture: true });
    window.addEventListener('resize', scheduleAnchorSnapshot, { passive: true });
    window.addEventListener('pointerdown', updateAnchorSnapshot, { passive: true, capture: true });
    window.addEventListener('keydown', updateAnchorSnapshot, { capture: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', scheduleAnchorSnapshot, { capture: true });
      window.removeEventListener('resize', scheduleAnchorSnapshot);
      window.removeEventListener('pointerdown', updateAnchorSnapshot, { capture: true });
      window.removeEventListener('keydown', updateAnchorSnapshot, { capture: true });
    };
  }, [container, enabled]);

  useIsoLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      previousAnchorRef.current = null;
      return;
    }

    const previousAnchor = previousAnchorRef.current;

    if (previousAnchor) {
      const anchoredPosition = layout.positions.find((position) => position.key === previousAnchor.key);
      if (anchoredPosition) {
        const desiredScrollY = getContainerDocumentY(container) + anchoredPosition.y - previousAnchor.viewportOffset;
        const delta = desiredScrollY - getWindowScrollY();
        if (Math.abs(delta) >= 1) {
          window.scrollTo({ top: desiredScrollY, left: 0, behavior: 'instant' });
        }
        previousAnchorRef.current = {
          key: previousAnchor.key,
          y: anchoredPosition.y,
          viewportOffset: previousAnchor.viewportOffset,
        };
        return;
      }
    }

    updateAnchorSnapshot();
  }, [container, enabled, layout.positions]);
}
