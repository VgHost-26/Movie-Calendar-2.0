import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export interface LenisScrollOptions {
  orientation?: 'horizontal' | 'vertical';
  gestureOrientation?: 'horizontal' | 'vertical' | 'both';
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  duration?: number;
}

export function useLenisScroll(options: LenisScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const {
    orientation = 'horizontal',
    gestureOrientation = 'vertical',
    smoothWheel = true,
    wheelMultiplier = 1,
    duration = 1.2,
  } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild as HTMLElement,
      orientation,
      gestureOrientation,
      smoothWheel,
      wheelMultiplier,
      duration,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [orientation, gestureOrientation, smoothWheel, wheelMultiplier, duration]);

  const scrollTo = useCallback(
    (target: number | HTMLElement | string, scrollOptions?: object) => {
      lenisRef.current?.scrollTo(target, scrollOptions);
    },
    []
  );

  const scroll = useCallback(() => lenisRef.current?.scroll ?? 0, []);

  return { containerRef, scrollTo, scroll, lenis: lenisRef };
}