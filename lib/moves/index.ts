// Demonstrations for Chapters 2–10, one table per chapter, keyed by drill ID.
import type {MoveTable} from "../shadow-kit";
import {CHAPTER_02} from "./chapter-02";
import {CHAPTER_03} from "./chapter-03";
import {CHAPTER_04} from "./chapter-04";
import {CHAPTER_05} from "./chapter-05";
import {CHAPTER_06} from "./chapter-06";
import {CHAPTER_07} from "./chapter-07";
import {CHAPTER_08} from "./chapter-08";
import {CHAPTER_09} from "./chapter-09";
import {CHAPTER_10} from "./chapter-10";
export type {MoveTable};
export const CHAPTER_MOVES:MoveTable={...CHAPTER_02,...CHAPTER_03,...CHAPTER_04,...CHAPTER_05,...CHAPTER_06,...CHAPTER_07,...CHAPTER_08,...CHAPTER_09,...CHAPTER_10};
