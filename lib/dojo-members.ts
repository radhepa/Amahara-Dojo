export type DojoMemberId = "akari" | "ren" | "sora" | "daichi" | "yuzu";

export type DojoMember = {
  id: DojoMemberId;
  name: string;
  role: string;
  focus: string;
  personality: string;
  biography: string;
  introduction: string;
  practiceCue: string;
  accent: string;
  portrait: string;
};

// Stable identities for future conversations and story chapters.
export const DOJO_MEMBERS: DojoMember[] = [
  {
    id: "akari", name: "Akari", role: "The steady leader", focus: "Discipline & precision",
    personality: "Quietly determined. Exacting with herself, patient with others.",
    biography: "Akari notices the small things: a rushed step, tense shoulders, a promise kept. She brings order to the dojo and believes progress begins with care for the basics. Her serious expression hides a dry sense of humor.",
    introduction: "Start where you are. We can work with that.",
    practiceCue: "Give one simple movement your full attention. Keep your stance tall and relaxed.",
    accent: "#b4e278", portrait: "/members/akari.png",
  },
  {
    id: "ren", name: "Ren", role: "The spark", focus: "Striking & confidence",
    personality: "Fearless, enthusiastic, and always ready to encourage a friend.",
    biography: "Ren is usually the first to arrive and the last to stop talking. He loves the rhythm of striking practice, but his own challenge is learning when to slow down. He celebrates another person's small win as loudly as his own.",
    introduction: "You showed up. That's something to build on.",
    practiceCue: "Save the intensity for your other training. Today's win is an easy, controlled session.",
    accent: "#efb28a", portrait: "/members/ren.png",
  },
  {
    id: "sora", name: "Sora", role: "The quiet tactician", focus: "Awareness & timing",
    personality: "Observant, thoughtful, and a little hard to read.",
    biography: "Sora listens before she speaks and watches before she moves. She enjoys finding the simplest answer to a complicated problem. If the dojo gets noisy, look for her in the quiet corner, noticing something everyone else missed.",
    introduction: "A small step still changes your position.",
    practiceCue: "Notice where your weight sits. Take your time; small, comfortable movements are enough.",
    accent: "#b1c8e5", portrait: "/members/sora.png",
  },
  {
    id: "daichi", name: "Daichi", role: "The patient anchor", focus: "Balance & recovery",
    personality: "Warmhearted, dependable, and impossible to hurry.",
    biography: "Daichi is the person everyone finds after a difficult day. He has a sturdy presence, an easy laugh, and a fondness for unhurried practice. He treats rest with the same respect as effort and makes room for every starting point.",
    introduction: "There is no hurry. We are building something that lasts.",
    practiceCue: "Use chair support whenever it helps. On Wednesday, let the promise be a full day of rest.",
    accent: "#dec7a1", portrait: "/members/daichi.png",
  },
  {
    id: "yuzu", name: "Yuzu", role: "The playful mover", focus: "Footwork & flow",
    personality: "Curious, mischievous, and quick to turn practice into a game.",
    biography: "Yuzu brings a grin and an unexpected idea to every session. She loves the puzzle of moving lightly through space. Beneath the teasing is a sharp eye for detail; she knows playful practice still needs patience and control.",
    introduction: "Let's see what one careful step can do.",
    practiceCue: "Keep steps small and easy. You can explore movement without forcing a deep bend or stretch.",
    accent: "#d4b4de", portrait: "/members/yuzu.png",
  },
];

export function memberForDay(day: number): DojoMember {
  const weeklyHosts: DojoMemberId[] = ["akari", "daichi", "daichi", "yuzu", "ren", "sora", "sora"];
  return DOJO_MEMBERS.find(member => member.id === weeklyHosts[day]) ?? DOJO_MEMBERS[0];
}
