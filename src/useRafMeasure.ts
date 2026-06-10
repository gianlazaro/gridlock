import { useLayoutEffect } from 'react';
import { useSetAtom } from 'jotai';
import { containerWidthAtom } from './store';

const useIsoLayoutEffect = typeof window === 'undefined' ? () => undefined : useLayoutEffect;

export function useRafContainerWidth(element: HTMLElement | null, initialWidth = 0) {
  const setWidth = useSetAtom(containerWidthAtom);

  useIsoLayoutEffect(() => {
    setWidth(initialWidth);
  }, [initialWidth, setWidth]);

  useIsoLayoutEffect(() => {
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    let frame = 0;
    const commitWidth = (width: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(width));
    };

    commitWidth(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      commitWidth(entry.contentRect.width);
    });

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [element, setWidth]);
}
