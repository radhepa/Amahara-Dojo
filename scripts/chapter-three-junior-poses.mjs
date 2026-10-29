// Contributor-only portrait directions. The gallery receives neutral labels.
import path from 'node:path';
const poses={
 amused:'A natural amused smile with a little teeth showing, eyes lively; comfortably shift weight to one hip, one wrapped hand lightly touching her upper chest, the other open palm making a small relaxed conversational gesture at waist height. Shoulders open, visibly different arms and silhouette from neutral.',
 concerned:'A worried thoughtful expression, brows lifted toward the centre and lips gently pressed; shoulders drawn slightly inward, one hand lightly holding the opposite forearm across the lower torso, the other fully visible hand resting open near the opposite elbow. A slight forward lean, both hands visible. No new props.',
 angry:'Controlled frustration, brows narrowed and mouth firm; grounded upright stance with a slight three-quarter turn, one wrapped hand resting firmly at her hip, the other held palm-out at waist height in a clear boundary gesture. Both complete hands visible. No violence or props.',
 determined:'Steady focused gaze, chin slightly raised, squared shoulders and weight forward; one wrapped fist held close to her chest and the other open hand extended forward at mid-torso height, a grounded ready guard. Natural coherent arms, wrists and fingers, all inside the canvas.',
 soft:'Gentle warm small smile and softened eyes, lowered shoulders and a slight receptive head tilt; both relaxed hands loosely meeting at waist level with one resting over the other. Quiet open body language and a distinct relaxed silhouette.'
};
export function juniorMoodAssets(root){
 return Object.entries(poses).map(([mood,pose])=>({
  key:`academy-junior-${mood}`,kind:'characters',file:`academy-junior-${mood}.png`,
  prompt:`Use case: precise-object-edit. Asset: ${mood} standing anime visual-novel portrait for Character study K. Input: this character's EXACT redesigned neutral portrait, used as the identity, outfit, drawing-scale and art-style lock. Preserve her rich deep-brown skin, broad softly square adult face, full rounded cheeks, wider straight nose, dark-brown eyes, straight thick brows, full lips and SHORT ink-black textured pixie hair with clipped sides, short diagonal fringe and visible ears. Preserve the EXACT white training jacket with ash-grey lapels and cuffs, charcoal sash and trousers, and cream hand wraps. Keep the same 22-year-old adult woman and grounded proportions. NO braid, long hair, ponytail or copying another character's face. Match precise crisp dark anime linework, restrained cel shading, warm natural palette and believable cloth folds. Change BOTH facial expression AND hands, arms, shoulders and implied standing weight to communicate the mood; never a face-only swap. Pose and expression: ${pose} Vertical 2:3 1024x1536, full head through upper thighs at original figure scale; all hair, BOTH complete hands and every finger safely within the frame. GENUINE transparent alpha background and arm/body gaps, clean antialiased silhouette. No background glow, halo, scenery, ground shadow, extra props, text, logos, UI, watermark, photorealism, chibi or fan-service. Single portrait only.`,
  referenced_image_paths:[path.join(root,'artwork/source/chapter-03/characters/academy-junior-neutral.png')],
  transparent_background:true,gallerySafe:true
 }));
}
