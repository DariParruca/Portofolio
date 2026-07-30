import { useEffect, useRef } from "react";

export default function CelestialGateSVG({ side = "left" }: { side?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/celestial-gate.svg");
        const text = await res.text();
        if (cancelled || !ref.current) return;

        // Both panels inject the same SVG. Duplicate IDs in the DOM break
        // clip-path and gradient references (the wrong instance is resolved).
        // Suffix every id="…" and every url(#…) reference so each panel is isolated.
        const sfx = side === "left" ? "L" : "R";
        const unique = text
          .replace(/\bid="([^"]+)"/g,      `id="$1-${sfx}"`)
          .replace(/url\(#([^)]+)\)/g,     `url(#$1-${sfx})`);

        ref.current.innerHTML = unique;
        const svgEl = ref.current.querySelector("svg") as SVGSVGElement | null;
        if (!svgEl) return;
        svgEl.style.position = "absolute";
        svgEl.style.top    = "0";
        svgEl.style.width  = "200%";
        svgEl.style.height = "100%";
        svgEl.style.left   = side === "left" ? "0" : "-100%";
        svgEl.setAttribute("preserveAspectRatio", "none");
        svgEl.setAttribute("focusable", "false");
      } catch (e) {
        console.error("Failed to load celestial gate svg:", e);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [side]);

  return <div ref={ref} style={{ position: "absolute", inset: 0 }} aria-hidden="true" />;
}
