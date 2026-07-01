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

/**
 * WhatsApp click-to-chat. Number is digits-only (no +, spaces or symbols).
 * The bracketed placeholders in the message are intentional — the sender fills
 * them in before hitting send.
 */
export const WHATSAPP_NUMBER = "917738053594";
export const WHATSAPP_MESSAGE =
  "Hi, we would like you to create [THEME/NICHE] videos for our [Facebook ad | Instagram | Tiktok]";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

/** Maps a project aspect ratio to its CSS `aspect-ratio` value. */
export const ASPECT: Record<AspectRatio, string> = {
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
};
