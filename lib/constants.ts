import type { AspectRatio } from "@/data/projects";

/**
 * Shared, dependency-free UI constants. Kept out of lib/gsap.ts on purpose so
 * GSAP-free components can import these without pulling in the GSAP bundle.
 */

/** Brand cubic-bezier ease for Framer Motion transitions — everything glides. */
export const GLIDE_CUBIC = [0.16, 1, 0.3, 1] as const;

/** Official AdventHQ Instagram profile. */
export const INSTAGRAM_URL = "https://www.instagram.com/i.adventhq/";

/** Primary contact email. */
export const CONTACT_EMAIL = "adwaitg02@gmail.com";

/** Maps a project aspect ratio to its CSS `aspect-ratio` value. */
export const ASPECT: Record<AspectRatio, string> = {
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
};
