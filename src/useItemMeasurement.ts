import { type RefCallback, useCallback, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { getIsWindowScrolling, runWhenScrollIdle } from './scrollActivity';
import { setMeasuredHeightAtom } from './store';
import type { MasonryKey } from './types';

export function useItemMeasurement(key: MasonryKey): RefCallback<HTMLElement> {
  const setMeasuredHeight = useSetAtom(setMeasuredHeightAtom);
  const observerRef = useRef<ResizeObserver | null>(null);
  const frameRef = useRef(0);
  const idleCleanupRef = useRef<(() => void) | null>(null);
  const pendingHeightRef = useRef<number | null>(null);

  return useCallback(
    (node) => {
      cancelAnimationFrame(frameRef.current);
      idleCleanupRef.current?.();
      idleCleanupRef.current = null;
      observerRef.current?.disconnect();
      observerRef.current = null;
      pendingHeightRef.current = null;

      if (!node || typeof ResizeObserver === 'undefined') return;

      const commitNow = (height: number) => {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => setMeasuredHeight({ key, height }));
      };

      const commit = (height: number) => {
        if (height <= 1) return;

        if (!getIsWindowScrolling()) {
          commitNow(height);
          return;
        }

        pendingHeightRef.current = height;
        idleCleanupRef.current ??= runWhenScrollIdle(() => {
          const pendingHeight = pendingHeightRef.current;
          pendingHeightRef.current = null;
          idleCleanupRef.current = null;
          if (pendingHeight !== null) commitNow(pendingHeight);
        });
      };

      commit(node.getBoundingClientRect().height);

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) commit(entry.contentRect.height);
      });

      observer.observe(node);
      observerRef.current = observer;
    },
    [key, setMeasuredHeight],
  );
}
