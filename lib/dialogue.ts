export type DialogueSpeed = "steady" | "quick" | "instant";
export const DIALOGUE_SPEEDS: DialogueSpeed[] = ["steady", "quick", "instant"];

/** Reveal whole graphemes, including joined emoji and accented characters. */
export function dialogueTimeline(text: string, speed: DialogueSpeed) {
  const letters = Array.from(new Intl.Segmenter("en", {granularity: "grapheme"}).segment(text), part => part.segment);
  const step = speed === "quick" ? 13 : 25;
  let elapsed = 0;
  const at = letters.map((letter, i) => {
    const time = elapsed;
    // Only pause at the end of a punctuation run, so ellipses do not stall.
    const next = letters[i + 1] ?? "";
    const pause = /[.!?…]/u.test(letter) && !/[.!?…]/u.test(next) ? 150 : /[,;:—]/u.test(letter) ? 65 : 0;
    elapsed += speed === "instant" ? 0 : step + (speed === "quick" ? pause * .55 : pause);
    return time;
  });
  return {letters, at};
}

export function revealedAt(timeline: number[], elapsed: number) {
  let lo = 0, hi = timeline.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (timeline[mid] <= elapsed) lo = mid + 1; else hi = mid;
  }
  return lo;
}
