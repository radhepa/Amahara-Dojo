"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {dialogueTimeline, revealedAt, type DialogueSpeed} from "@/lib/dialogue";

export function useDialogueReveal(text: string, lineKey: string, open: boolean, speed: DialogueSpeed) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [frame, setFrame] = useState({key: "", count: 0});
  const timeline = useMemo(() => dialogueTimeline(text, speed), [text, speed]);
  const generation = `${lineKey}:${speed}:${text}`;
  const cancelled = useRef(false);
  const instant = reducedMotion || speed === "instant";
  const count = instant ? timeline.letters.length : frame.key === generation ? frame.count : 0;
  const complete = count >= timeline.letters.length;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    cancelled.current = false;
    if (!open) {setFrame({key: "", count: 0});return;}
    if (instant) return;
    let request = 0;
    const started = performance.now();
    const tick = (now: number) => {
      if (cancelled.current) return;
      const next = revealedAt(timeline.at, now - started);
      setFrame(previous => previous.key === generation && previous.count === next ? previous : {key: generation, count: next});
      if (next < timeline.letters.length) request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => {cancelled.current = true; cancelAnimationFrame(request);};
  }, [generation, open, instant, timeline]);

  const finish = useCallback(() => {
    cancelled.current = true;
    setFrame({key: generation, count: timeline.letters.length});
  }, [generation, timeline.letters.length]);

  return {complete, finish, count, visible: timeline.letters.slice(0, count).join(""), hidden: timeline.letters.slice(count).join(""), reducedMotion};
}

/** Optional, quiet synthesized dialogue ticks. Audio starts only from its toggle. */
export function useDialogueSound(open: boolean) {
  const [enabled, setEnabled] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const lastTick = useRef(0);

  useEffect(() => {
    if (!open) {
      const audio = context.current;
      context.current = null;
      setEnabled(false);
      void audio?.close().catch(() => {});
    }
    return () => {
      const audio = context.current;
      context.current = null;
      void audio?.close().catch(() => {});
    };
  }, [open]);

  const toggle = useCallback(() => {
    if (enabled) {setEnabled(false); return;}
    try {
      if (!context.current) lastTick.current = -Infinity;
      const audio = context.current ?? new AudioContext();
      context.current = audio;
      void audio.resume().then(() => {if (context.current === audio) setEnabled(true);}).catch(() => {});
    } catch {setEnabled(false);}
  }, [enabled]);

  const tick = useCallback((speaker: string) => {
    const audio = context.current;
    if (!enabled || !audio || audio.state !== "running" || audio.currentTime - lastTick.current < .075) return;
    lastTick.current = audio.currentTime;
    const pitches: Record<string, number> = {akari: 360, ren: 280, sora: 410, daichi: 210, yuzu: 470};
    const note = audio.createOscillator(), gain = audio.createGain();
    const now = audio.currentTime;
    note.type = "sine";
    note.frequency.setValueAtTime(pitches[speaker] ?? 310, now);
    note.frequency.exponentialRampToValueAtTime((pitches[speaker] ?? 310) * .72, now + .04);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.025, now + .006);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .045);
    note.connect(gain); gain.connect(audio.destination);
    note.onended = () => {note.disconnect(); gain.disconnect();};
    note.start(now); note.stop(now + .05);
  }, [enabled]);
  return {enabled, toggle, tick};
}
