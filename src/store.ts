import { atom } from 'jotai';
import type { MasonryKey } from './types';

export const containerWidthAtom = atom(0);
export const measuredHeightsAtom = atom(new Map<MasonryKey, number>());

export const setMeasuredHeightAtom = atom(
  null,
  (get, set, update: { key: MasonryKey; height: number; epsilon?: number }) => {
    const height = Math.max(1, update.height);
    const epsilon = update.epsilon ?? 1;
    const current = get(measuredHeightsAtom);
    const previous = current.get(update.key);

    if (previous !== undefined && Math.abs(previous - height) < epsilon) return;

    const next = new Map(current);
    next.set(update.key, height);
    set(measuredHeightsAtom, next);
  },
);

export const pruneMeasuredHeightsAtom = atom(null, (get, set, keys: Iterable<MasonryKey>) => {
  const allowed = new Set(keys);
  const current = get(measuredHeightsAtom);
  let changed = false;
  const next = new Map<MasonryKey, number>();

  for (const [key, height] of current) {
    if (allowed.has(key)) {
      next.set(key, height);
    } else {
      changed = true;
    }
  }

  if (changed) set(measuredHeightsAtom, next);
});
