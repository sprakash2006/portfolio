"use client";

import { useEffect, useRef, useState } from "react";

// "Lofi Relaxing" by velariomusic (Pixabay; free to use, no attribution required)
const TRACK = "/music/lofi-relaxing.mp3";
const VOLUME = 0.3;
const FADE_MS = 800;
const STORAGE_KEY = "music";

// Opt-in background music: off by default, fades in and out, loops, and remembers the choice.
// Browsers block autoplay with sound, so a returning visitor who left it on resumes on their first click.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef(0);
  const [playing, setPlaying] = useState(false);

  function fadeTo(target: number, done?: () => void) {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    try {
      await audio.play();
      setPlaying(true);
      fadeTo(VOLUME);
    } catch {
      setPlaying(false);
    }
  }

  function pause() {
    setPlaying(false);
    fadeTo(0, () => audioRef.current?.pause());
  }

  function toggle() {
    const next = !playing;
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
    if (next) play();
    else pause();
  }

  // Resume for visitors who left music on, at their first interaction with the page
  useEffect(() => {
    let wanted = false;
    try {
      wanted = localStorage.getItem(STORAGE_KEY) === "on";
    } catch {}
    if (!wanted) return;
    const resume = (e: Event) => {
      // A click on the toggle itself is handled by toggle()
      if ((e.target as HTMLElement).closest("[data-music-toggle]")) return;
      play();
    };
    window.addEventListener("pointerdown", resume, { once: true });
    return () => window.removeEventListener("pointerdown", resume);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), []);

  return (
    <>
      <audio ref={audioRef} src={TRACK} loop preload="none" />
      <button
        data-music-toggle
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        aria-pressed={playing}
        className={`rounded p-1.5 transition-colors hover:bg-card/60 hover:text-foreground ${playing ? "text-primary" : ""}`}
      >
        {/* Equalizer bars: still when paused, bouncing while playing */}
        <span aria-hidden className="flex h-4 w-4 items-end justify-center gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full bg-current ${playing ? "animate-equalizer" : ""}`}
              style={{
                height: playing ? undefined : `${[40, 70, 50, 30][i]}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </span>
      </button>
    </>
  );
}
