"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, value]);

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      <motion.span aria-hidden="true">{text}</motion.span>
    </span>
  );
}
