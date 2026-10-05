import './typescript-loader.mjs';
import assert from 'node:assert/strict';
import {dialogueTimeline, revealedAt} from '../lib/dialogue.ts';

const text = 'Wait… Ready? A\u0301 👨‍👩‍👧‍👦';
const steady = dialogueTimeline(text, 'steady');
assert.equal(steady.letters.join(''), text);
assert(steady.letters.includes('A\u0301'), 'Do not tear accented graphemes apart');
assert(steady.letters.includes('👨‍👩‍👧‍👦'), 'Do not tear joined emoji apart');
const ellipsis = steady.letters.indexOf('…');
assert(steady.at[ellipsis + 1] - steady.at[ellipsis] > 100, 'Punctuation should breathe');
assert.equal(revealedAt(steady.at, -1), 0);
assert.equal(revealedAt(steady.at, 0), 1);
assert.equal(revealedAt(steady.at, Infinity), steady.letters.length);
assert(dialogueTimeline(text, 'quick').at.at(-1) < steady.at.at(-1));
assert(dialogueTimeline(text, 'instant').at.every(time => time === 0));
assert.deepEqual(dialogueTimeline('', 'steady'), {letters: [], at: []});
for (let ms = 0, last = 0; ms <= steady.at.at(-1); ms += 7) {
  const count = revealedAt(steady.at, ms);
  assert(count >= last && count <= steady.letters.length);
  last = count;
}
console.log('Passed: Unicode-safe dialogue, punctuation pacing, reveal timing, speed choices, and empty lines.');
