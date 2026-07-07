import { useEffect, useRef, useState } from 'react';
import { FpsMeter } from '../utils/performanceUtils';
export function usePerformance() {
  const [fps, setFps] = useState(60);
  const meter = useRef(new FpsMeter());
  useEffect(() => { let frame = 0; const loop = () => { const next = meter.current.tick(); if (next) setFps(next); frame = requestAnimationFrame(loop); }; frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame); }, []);
  return { fps };
}
