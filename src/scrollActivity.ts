const idleCallbacks = new Set<() => void>();

let isListening = false;
let isScrolling = false;
let idleTimer = 0;

function flushIdleCallbacks() {
  const callbacks = Array.from(idleCallbacks);
  idleCallbacks.clear();
  for (const callback of callbacks) callback();
}

function markScrolling() {
  isScrolling = true;
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    isScrolling = false;
    flushIdleCallbacks();
  }, 180);
}

export function ensureScrollActivityListener() {
  if (isListening || typeof window === 'undefined') return;
  isListening = true;
  window.addEventListener('scroll', markScrolling, { passive: true, capture: true });
  window.addEventListener('wheel', markScrolling, { passive: true, capture: true });
  window.addEventListener('touchmove', markScrolling, { passive: true, capture: true });
}

export function getIsWindowScrolling() {
  ensureScrollActivityListener();
  return isScrolling;
}

export function runWhenScrollIdle(callback: () => void) {
  ensureScrollActivityListener();
  if (!isScrolling || typeof window === 'undefined') {
    callback();
    return () => undefined;
  }

  idleCallbacks.add(callback);
  return () => {
    idleCallbacks.delete(callback);
  };
}
