import { jsx as q } from "react/jsx-runtime";
import { atom as Y, useSetAtom as P, useAtomValue as j, Provider as oe } from "jotai";
import { useRef as E, useCallback as $, memo as _, useMemo as M, useLayoutEffect as ee, useEffect as D, useState as re, createElement as ie } from "react";
import { useWindowVirtualizer as se, defaultRangeExtractor as ce } from "@tanstack/react-virtual";
const W = /* @__PURE__ */ new Set();
let K = !1, T = !1, Q = 0;
function ue() {
  const t = Array.from(W);
  W.clear();
  for (const o of t) o();
}
function V() {
  T = !0, window.clearTimeout(Q), Q = window.setTimeout(() => {
    T = !1, ue();
  }, 180);
}
function te() {
  K || typeof window > "u" || (K = !0, window.addEventListener("scroll", V, { passive: !0, capture: !0 }), window.addEventListener("wheel", V, { passive: !0, capture: !0 }), window.addEventListener("touchmove", V, { passive: !0, capture: !0 }));
}
function ae() {
  return te(), T;
}
function fe(t) {
  return te(), !T || typeof window > "u" ? (t(), () => {
  }) : (W.add(t), () => {
    W.delete(t);
  });
}
const ne = Y(0), L = Y(/* @__PURE__ */ new Map()), le = Y(
  null,
  (t, o, e) => {
    const n = Math.max(1, e.height), i = e.epsilon ?? 1, c = t(L), r = c.get(e.key);
    if (r !== void 0 && Math.abs(r - n) < i) return;
    const s = new Map(c);
    s.set(e.key, n), o(L, s);
  }
), de = Y(null, (t, o, e) => {
  const n = new Set(e), i = t(L);
  let c = !1;
  const r = /* @__PURE__ */ new Map();
  for (const [s, u] of i)
    n.has(s) ? r.set(s, u) : c = !0;
  c && o(L, r);
});
function he(t) {
  const o = P(le), e = E(null), n = E(0), i = E(null), c = E(null);
  return $(
    (r) => {
      var a, h;
      if (cancelAnimationFrame(n.current), (a = i.current) == null || a.call(i), i.current = null, (h = e.current) == null || h.disconnect(), e.current = null, c.current = null, !r || typeof ResizeObserver > "u") return;
      const s = (f) => {
        cancelAnimationFrame(n.current), n.current = requestAnimationFrame(() => o({ key: t, height: f }));
      }, u = (f) => {
        if (!(f <= 1)) {
          if (!ae()) {
            s(f);
            return;
          }
          c.current = f, i.current ?? (i.current = fe(() => {
            const d = c.current;
            c.current = null, i.current = null, d !== null && s(d);
          }));
        }
      };
      u(r.getBoundingClientRect().height);
      const l = new ResizeObserver((f) => {
        const d = f[0];
        d && u(d.contentRect.height);
      });
      l.observe(r), e.current = l;
    },
    [t, o]
  );
}
function me({
  item: t,
  index: o,
  position: e,
  isMeasured: n,
  className: i,
  itemStyle: c,
  renderItem: r
}) {
  const s = he(e.key), u = M(() => ({ item: t, index: o, position: e, isMeasured: n }), [t, o, e, n]), l = M(
    () => typeof i == "function" ? i(u) : i,
    [u, i]
  ), a = M(
    () => typeof c == "function" ? c(u) : c,
    [u, c]
  ), h = M(
    () => ({
      position: "absolute",
      left: 0,
      top: 0,
      width: e.width,
      transform: `translate3d(${e.x}px, ${e.y}px, 0)`,
      contain: "layout paint style",
      contentVisibility: "auto",
      ...a
    }),
    [e.width, e.x, e.y, a]
  );
  return /* @__PURE__ */ q(
    "div",
    {
      ref: s,
      className: l,
      "data-masonry-index": o,
      role: "listitem",
      style: h,
      children: r(u)
    }
  );
}
const we = _(me), N = typeof window > "u" ? () => {
} : ee;
function B() {
  return typeof window > "u" ? 0 : window.scrollY || window.pageYOffset || 0;
}
function U(t) {
  return !t || typeof window > "u" ? 0 : t.getBoundingClientRect().top + B();
}
function J() {
  return typeof window > "u" ? 0 : window.innerHeight * 0.35;
}
function ye(t, o) {
  let e = null;
  for (const n of t) {
    if (n.y <= o && n.y + n.height >= o)
      return { key: n.key, y: n.y, viewportOffset: 0 };
    n.y > o && (!e || n.y < e.y || n.y === e.y && n.index < e.index) && (e = n);
  }
  return e ? { key: e.key, y: e.y, viewportOffset: 0 } : null;
}
function pe(t, o, e = !0) {
  const n = E(null), i = E(o), c = E(0), r = () => {
    const s = U(t), u = J(), a = (t ? Array.from(t.querySelectorAll("[data-masonry-index]")) : []).find((d) => {
      const m = d.getBoundingClientRect();
      return m.top <= u && m.bottom >= u;
    });
    if (a) {
      const d = Number(a.dataset.masonryIndex), m = i.current.positions[d];
      if (m) {
        n.current = {
          key: m.key,
          y: m.y,
          viewportOffset: a.getBoundingClientRect().top
        };
        return;
      }
    }
    const h = Math.max(0, B() + J() - s), f = ye(i.current.positions, h);
    n.current = f ? {
      ...f,
      viewportOffset: s + f.y - B()
    } : null;
  };
  N(() => {
    i.current = o;
  }, [o]), N(() => {
    if (!e || typeof window > "u") {
      n.current = null;
      return;
    }
    const s = () => {
      cancelAnimationFrame(c.current), c.current = requestAnimationFrame(r);
    };
    return r(), window.addEventListener("scroll", s, { passive: !0, capture: !0 }), window.addEventListener("resize", s, { passive: !0 }), window.addEventListener("pointerdown", r, { passive: !0, capture: !0 }), window.addEventListener("keydown", r, { capture: !0 }), () => {
      cancelAnimationFrame(c.current), window.removeEventListener("scroll", s, { capture: !0 }), window.removeEventListener("resize", s), window.removeEventListener("pointerdown", r, { capture: !0 }), window.removeEventListener("keydown", r, { capture: !0 });
    };
  }, [t, e]), N(() => {
    if (!e || typeof window > "u") {
      n.current = null;
      return;
    }
    const s = n.current;
    if (s) {
      const u = o.positions.find((l) => l.key === s.key);
      if (u) {
        const l = U(t) + u.y - s.viewportOffset, a = l - B();
        Math.abs(a) >= 1 && window.scrollTo({ top: l, left: 0, behavior: "instant" }), n.current = {
          key: s.key,
          y: u.y,
          viewportOffset: s.viewportOffset
        };
        return;
      }
    }
    r();
  }, [t, e, o.positions]);
}
const X = (t, o) => Number.isFinite(t) && t > 0 ? t : o;
function ge(t, o, e, n) {
  const i = X(t, 1), c = X(o, 1), r = Math.max(0, e), s = Math.max(1, Math.floor((i + r) / (c + r)));
  return Math.max(1, Math.min(s, n ?? s));
}
function ve(t) {
  let o = 0, e = t[0] ?? 0;
  for (let n = 1; n < t.length; n += 1) {
    const i = t[n];
    i < e && (e = i, o = n);
  }
  return o;
}
function Me({
  items: t,
  width: o,
  gap: e,
  minColumnWidth: n,
  getItemKey: i,
  estimateItemHeight: c,
  measuredHeights: r,
  maxColumnCount: s,
  placement: u = "balanced"
}) {
  const l = ge(o, n, e, s), a = Math.max(0, e), h = Math.max(1, (Math.max(1, o) - a * (l - 1)) / l), f = Array.from({ length: l }, () => 0), d = new Array(t.length);
  for (let w = 0; w < t.length; w += 1) {
    const p = t[w], k = i(p, w), S = r == null ? void 0 : r.get(k), g = c(p, w, h), y = Math.max(1, S ?? g), b = u === "balanced" ? ve(f) : w % l, I = b * (h + a), x = f[b];
    d[w] = { index: w, key: k, column: b, x: I, y: x, width: h, height: y }, f[b] = x + y + a;
  }
  let m = 0;
  for (const w of f)
    m = Math.max(m, w - a);
  return {
    columnCount: l,
    columnWidth: h,
    height: Math.max(0, m),
    positions: d
  };
}
function ke(t, o) {
  const e = Math.max(1, o.bucketSize), n = /* @__PURE__ */ new Map();
  let i = 0;
  const c = new Uint32Array(t.length);
  let r = 0;
  for (const u of t) {
    const l = Math.floor(u.y / e), a = Math.floor((u.y + u.height) / e);
    i = Math.max(i, a);
    for (let h = l; h <= a; h += 1) {
      const f = n.get(h);
      f ? f.push(u.index) : n.set(h, [u.index]);
    }
  }
  const s = Math.max(1, Math.ceil(o.contentHeight / e), i + 1);
  return {
    bucketSize: e,
    bucketCount: s,
    buckets: n,
    query(u, l) {
      r = r === 4294967295 ? 1 : r + 1, r === 1 && c.fill(0);
      const a = Math.floor(Math.max(0, u) / e), h = Math.floor(Math.max(u, l) / e), f = [];
      for (let d = a; d <= h; d += 1) {
        const m = n.get(d);
        if (m)
          for (const w of m) {
            if (c[w] === r) continue;
            const p = t[w];
            p && p.y <= l && p.y + p.height >= u && (c[w] = r, f.push(w));
          }
      }
      return f.sort((d, m) => d - m);
    }
  };
}
function xe(t) {
  const {
    items: o,
    bucketSize: e = 600,
    gap: n,
    minColumnWidth: i,
    getItemKey: c,
    estimateItemHeight: r,
    maxColumnCount: s,
    placement: u,
    overscan: l = 1,
    scrollMargin: a = 0,
    initialWidth: h,
    onEndReached: f,
    endReachedMargin: d = e * 2
  } = t, m = j(ne) || h || 0, w = j(L), p = P(de), k = E(!1), S = M(() => o.map(c), [c, o]);
  D(() => {
    p(S);
  }, [S, p]);
  const g = M(
    () => Me({
      items: o,
      width: m,
      gap: n,
      minColumnWidth: i,
      getItemKey: c,
      estimateItemHeight: r,
      measuredHeights: w,
      maxColumnCount: s,
      placement: u
    }),
    [o, m, n, i, c, r, w, s, u]
  ), y = M(
    () => ke(g.positions, { bucketSize: e, contentHeight: Math.max(g.height, e) }),
    [e, g.height, g.positions]
  ), b = $(() => y.bucketSize, [y.bucketSize]), I = se({
    count: Math.max(1, Math.ceil(g.height / y.bucketSize)),
    estimateSize: b,
    overscan: l,
    scrollMargin: a,
    rangeExtractor: ce
  }), x = I.getVirtualItems(), R = M(() => {
    if (x.length === 0) return { start: 0, end: y.bucketSize };
    const v = x[0].start, z = x[x.length - 1];
    return { start: v, end: z.end };
  }, [y.bucketSize, x]), C = M(
    () => y.query(R.start, R.end),
    [y, R.end, R.start]
  ), F = typeof window > "u" ? R.end : window.scrollY + window.innerHeight - a;
  return D(() => {
    if (!f || o.length === 0) return;
    if (!(F >= g.height - d)) {
      k.current = !1;
      return;
    }
    if (k.current) return;
    k.current = !0;
    let z = !1;
    const H = () => {
      z = !0, f();
    }, A = typeof requestAnimationFrame > "u" ? window.setTimeout(H, 0) : requestAnimationFrame(H);
    return () => {
      z || (k.current = !1), typeof cancelAnimationFrame > "u" ? window.clearTimeout(A) : cancelAnimationFrame(A);
    };
  }, [d, o.length, g.height, f, F]), {
    layout: g,
    spatialHash: y,
    visibleIndexes: C,
    rowVirtualizer: I,
    width: m,
    measuredHeights: w
  };
}
const Z = typeof window > "u" ? () => {
} : ee;
function be(t, o = 0) {
  const e = P(ne);
  Z(() => {
    e(o);
  }, [o, e]), Z(() => {
    if (!t || typeof ResizeObserver > "u") return;
    let n = 0;
    const i = (r) => {
      cancelAnimationFrame(n), n = requestAnimationFrame(() => e(r));
    };
    i(t.getBoundingClientRect().width);
    const c = new ResizeObserver((r) => {
      const s = r[0];
      s && i(s.contentRect.width);
    });
    return c.observe(t), () => {
      cancelAnimationFrame(n), c.disconnect();
    };
  }, [t, e]);
}
function Ae({
  as: t = "div",
  className: o,
  style: e,
  itemClassName: n,
  itemStyle: i,
  children: c,
  renderItem: r,
  role: s = "list",
  initialWidth: u = 0,
  maintainScrollPosition: l = !0,
  items: a,
  bucketSize: h,
  gap: f,
  minColumnWidth: d,
  getItemKey: m,
  estimateItemHeight: w,
  maxColumnCount: p,
  placement: k,
  overscan: S = 0,
  scrollMargin: g,
  onEndReached: y,
  endReachedMargin: b
}) {
  const [I, x] = re(null), R = $((A) => {
    x(A);
  }, []);
  be(I, u);
  const C = c ?? r, F = M(
    () => ({
      items: a,
      bucketSize: h,
      gap: f,
      minColumnWidth: d,
      getItemKey: m,
      estimateItemHeight: w,
      maxColumnCount: p,
      placement: k,
      overscan: S,
      scrollMargin: g,
      initialWidth: u,
      onEndReached: y,
      endReachedMargin: b
    }),
    [
      a,
      h,
      f,
      d,
      m,
      w,
      p,
      k,
      S,
      g,
      u,
      y,
      b
    ]
  ), v = xe(F);
  pe(I, v.layout, l);
  const z = M(
    () => ({
      position: "relative",
      width: "100%",
      height: v.layout.height,
      overflowAnchor: "none",
      ...e
    }),
    [v.layout.height, e]
  ), H = M(
    () => v.visibleIndexes.map((A) => {
      const O = v.layout.positions[A], G = a[A];
      return !O || G === void 0 ? null : /* @__PURE__ */ q(
        we,
        {
          item: G,
          index: A,
          position: O,
          isMeasured: v.measuredHeights.has(O.key),
          className: n,
          itemStyle: i,
          renderItem: C
        },
        O.key
      );
    }),
    [
      a,
      n,
      i,
      v.layout.positions,
      v.measuredHeights,
      v.visibleIndexes,
      C
    ]
  );
  return ie(
    t,
    {
      ref: R,
      className: o,
      role: s,
      style: z
    },
    H
  );
}
function Ee(t) {
  return /* @__PURE__ */ q(oe, { children: /* @__PURE__ */ q(Ae, { ...t }) });
}
const Le = _(Ee);
export {
  Le as Masonry,
  we as MasonryItem,
  ne as containerWidthAtom,
  Me as createMasonryLayout,
  ke as createSpatialHash,
  ye as findScrollAnchor,
  ge as getColumnCount,
  L as measuredHeightsAtom,
  de as pruneMeasuredHeightsAtom,
  le as setMeasuredHeightAtom,
  he as useItemMeasurement,
  xe as useMasonry,
  be as useRafContainerWidth,
  pe as useStableScrollAnchor
};
