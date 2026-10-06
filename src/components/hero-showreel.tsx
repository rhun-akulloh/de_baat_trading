"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useI18n } from "./i18n-provider";

export type ReelTag = { label: string; price: string; className: string; delay: number };

export function HeroShowreel({ tags }: { tags: ReelTag[] }) {
  const { dict } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Respect reduced-motion: start paused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.pause();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-accent-gradient opacity-30 blur-3xl" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/20 bg-black shadow-[0_40px_90px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10"
      >
        <video
          ref={ref}
          className="absolute inset-0 size-full object-cover"
          src="/media/hero.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#00103d]/70 via-transparent to-transparent" />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          {dict.home.badge.split("·")[0].trim()}
        </div>
      </motion.div>

      {tags.map((t) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + t.delay, duration: 0.6 }}
          className={`absolute ${t.className}`}
        >
          <div className="animate-float glass border-white/30 rounded-2xl border px-4 py-3 shadow-xl" style={{ animationDelay: `${t.delay * 2}s` }}>
            <p className="text-xs font-semibold text-muted">{t.label}</p>
            <p className="font-display text-lg leading-tight font-extrabold text-ink">{t.price}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
