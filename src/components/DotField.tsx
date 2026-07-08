"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport cursor-reactive dot grid, drawn on canvas. Dots swell and
 * get pushed away near the pointer. Ported from the design mockup.
 */
export default function DotField({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  darkRef.current = dark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      width = rect.width;
      height = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && Math.abs(rect.width - width) > 0.5) resize();

      ctx.clearRect(0, 0, width, height);
      const dark = darkRef.current;
      const gap = 32;
      const baseRadius = 1.5;
      const influenceRadius = 155;

      for (let y = gap; y < height; y += gap) {
        for (let x = gap; x < width; x += gap) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / influenceRadius);
          const push = influence * 10;
          const ux = dist > 0.001 ? dx / dist : 0;
          const uy = dist > 0.001 ? dy / dist : 0;
          const radius = baseRadius + influence * 2.6;
          const alpha = (dark ? 0.16 : 0.14) + influence * (dark ? 0.5 : 0.42);

          ctx.beginPath();
          ctx.arc(x + ux * push, y + uy * push, Math.max(0.3, radius), 0, 6.2832);
          ctx.fillStyle =
            (dark ? "rgba(235,238,244," : "rgba(20,22,28,") +
            Math.min(0.85, alpha).toFixed(3) +
            ")";
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    loop();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] block h-full w-full"
    />
  );
}
