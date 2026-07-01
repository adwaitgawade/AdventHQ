/**
 * AdventHQ — Selected Work data (single source of truth).
 *
 * v1 ships placeholder media:
 *  - posters are locally generated SVGs in /public/posters (see scripts/gen-posters.mjs)
 *  - clips point at royalty-free sample MP4s on a stable CDN
 * Every asset path is marked `// TODO: replace with real AdventHQ asset`.
 */

export type Category = "ads" | "vfx" | "ugc" | "marketing" | "hyper";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export type Stat = { label: string; value: number; suffix?: string };

export type CaseStudy = {
  brief: string;
  approach: string;
  role: string[];
  stills: string[];
  clips?: string[];
  stats?: Stat[];
};

export type Project = {
  id: string;
  title: string;
  client: string;
  category: Category;
  year: number;
  aspectRatio: AspectRatio;
  poster: string; // image shown before/while video loads
  previewSrc: string; // short muted loop for hover/in-grid
  fullSrc: string; // full clip for lightbox/case study
  featured?: boolean;
  caseStudy?: CaseStudy;
};

/** Human-readable labels + the filter order for category chips. */
export const CATEGORY_LABELS: Record<Category, string> = {
  ads: "Ads & Product Films",
  vfx: "3D & VFX / Titles",
  ugc: "UGC",
  marketing: "Marketing",
  hyper: "Hyper Motion",
};

export const FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ads", label: "Ads & Product Films" },
  { id: "vfx", label: "3D & VFX / Titles" },
  { id: "ugc", label: "UGC" },
  { id: "marketing", label: "Marketing" },
  { id: "hyper", label: "Hyper Motion" },
];

// TODO: replace with real AdventHQ asset CDN.
const CDN = "https://storage.googleapis.com/gtv-videos-bucket/sample";

// Real AdventHQ assets. Heavy video is served from R2; stills/posters stay in
// /public/portfolio.
const R2 = "https://pub-0ff0ac88318440fa82f78feb1561ed93.r2.dev";
const REMEDY = "/portfolio/hyper-motion/remedy-drinks";
const remedyStill = (n: number) => `${REMEDY}/images/web/${n}.jpg`;

const AURORA = "/portfolio/ads/aurora-shoes";
const auroraStill = (n: number) => `${AURORA}/images/${n}.png`;

const poster = (id: string) => `/posters/${id}.svg`; // TODO: replace with real still

export const projects: Project[] = [
  {
    id: "remedy-hyper",
    title: "Remedy — Hyper Reel",
    client: "Remedy Drinks",
    category: "hyper",
    year: 2026,
    aspectRatio: "9:16",
    poster: remedyStill(14),
    previewSrc: `${R2}/hyper-motion/remedydrinks.mp4`,
    fullSrc: `${R2}/hyper-motion/remedydrinks.mp4`,
    caseStudy: {
      brief:
        "Remedy wanted a sound-on, scroll-stopping hero for their no-sugar Pomegranate kombucha — a vertical film that felt like a hit of energy, not another can-on-a-table product shot.",
      approach:
        "We built the spot around the can as a fixed anchor and let everything else move: CG liquid crowns, bursting pomegranate, a cosmic ribbon of juice. Every beat is cut to the track so the first three seconds land before a thumb can scroll past, then we pull back to the label and the organic story — fruit, tea, no sugar.",
      role: ["Creative Direction", "3D / CG", "Hyper Motion", "Edit", "Sound Design"],
      stills: [
        remedyStill(4),
        remedyStill(12),
        remedyStill(15),
        remedyStill(6),
        remedyStill(1),
        remedyStill(7),
      ],
      stats: [
        { label: "3-second hold rate", value: 74, suffix: "%" },
        { label: "Reach in week one", value: 6.1, suffix: "M" },
        { label: "Saves & shares", value: 88, suffix: "K" },
      ],
    },
  },
  {
    id: "aurora-running",
    title: "Aurora — Run Free",
    client: "Aurora Athletics",
    category: "ads",
    year: 2025,
    aspectRatio: "16:9",
    poster: auroraStill(1),
    previewSrc: `${AURORA}/aurora-shoes-gwr.mp4`,
    fullSrc: `${AURORA}/aurora-shoes-gwr.mp4`,
    featured: true,
    caseStudy: {
      brief:
        "Aurora wanted a launch film for their first carbon-plate racer that felt like momentum itself — not another slow-mo shoe ad.",
      approach:
        "We built a single unbroken move that hands off between live plates and CG, letting the product appear only at peak velocity. Type kinetically tracks the runner's cadence.",
      role: ["Creative Direction", "Design", "3D / CG", "Animation", "Edit"],
      stills: [auroraStill(1), auroraStill(2)],
      clips: [`${AURORA}/shoe-360-gwr.mp4`],
      stats: [
        { label: "Launch-day views", value: 4.2, suffix: "M" },
        { label: "Add-to-cart lift", value: 38, suffix: "%" },
        { label: "Production days", value: 21 },
      ],
    },
  },
  {
    id: "nyx-titles",
    title: "NYX — Title Sequence",
    client: "NYX Studios",
    category: "vfx",
    year: 2025,
    aspectRatio: "16:9",
    poster: poster("nyx-titles"),
    previewSrc: `${CDN}/TearsOfSteel.mp4`, // TODO: replace
    fullSrc: `${CDN}/TearsOfSteel.mp4`, // TODO: replace
    featured: true,
    caseStudy: {
      brief:
        "An opening title sequence for a sci-fi anthology that had to feel premium across eight wildly different episodes.",
      approach:
        "A modular type system rendered in 3D with procedural volumetrics — one rig, infinite variations. Each episode reskins via tokens, mirroring how this very site works.",
      role: ["Art Direction", "3D / Houdini", "Compositing", "Sound Design"],
      stills: [poster("nyx-titles"), poster("volt-hyper"), poster("monolith-3d")],
      stats: [
        { label: "Episodes shipped", value: 8 },
        { label: "Frames rendered", value: 192, suffix: "K" },
        { label: "Awards", value: 3 },
      ],
    },
  },
  {
    id: "flux-ui",
    title: "Flux — Product Film",
    client: "Flux Labs",
    category: "marketing",
    year: 2024,
    aspectRatio: "16:9",
    poster: poster("flux-ui"),
    previewSrc: `${CDN}/ForBiggerEscapes.mp4`, // TODO: replace
    fullSrc: `${CDN}/ForBiggerEscapes.mp4`, // TODO: replace
    caseStudy: {
      brief:
        "Explain a dense B2B analytics product in 60 seconds without a single boring UI screen-record.",
      approach:
        "We rebuilt the interface as a living 3D space the camera flies through, so data feels physical. Motion carries the narrative; copy stays out of the way.",
      role: ["Concept", "Design", "Animation"],
      stills: [poster("flux-ui"), poster("aurora-running")],
      stats: [
        { label: "Demo-to-trial", value: 27, suffix: "%" },
        { label: "Avg. watch time", value: 48, suffix: "s" },
      ],
    },
  },
  {
    id: "volt-hyper",
    title: "Volt — Hyper Cut",
    client: "Volt Energy",
    category: "hyper",
    year: 2025,
    aspectRatio: "9:16",
    poster: poster("volt-hyper"),
    previewSrc: `${CDN}/ForBiggerFun.mp4`, // TODO: replace
    fullSrc: `${CDN}/ForBiggerFun.mp4`, // TODO: replace
    featured: true,
    caseStudy: {
      brief:
        "A vertical hyper-motion spot built for the first three seconds of a scroll — stop the thumb or fail.",
      approach:
        "Beat-mapped every cut to the track, then pushed transitions past the speed of comprehension and pulled back only on the logo. Made for sound-off, rewards sound-on.",
      role: ["Direction", "Edit", "Hyper Motion"],
      stills: [poster("volt-hyper"), poster("pulse-ugc")],
      stats: [
        { label: "3s hold rate", value: 71, suffix: "%" },
        { label: "Shares", value: 120, suffix: "K" },
      ],
    },
  },
  {
    id: "monolith-3d",
    title: "Monolith — Brand Film",
    client: "Monolith",
    category: "vfx",
    year: 2024,
    aspectRatio: "16:9",
    poster: poster("monolith-3d"),
    previewSrc: `${CDN}/Sintel.mp4`, // TODO: replace
    fullSrc: `${CDN}/Sintel.mp4`, // TODO: replace
  },
  {
    id: "pulse-ugc",
    title: "Pulse — Creator Series",
    client: "Pulse App",
    category: "ugc",
    year: 2025,
    aspectRatio: "9:16",
    poster: poster("pulse-ugc"),
    previewSrc: `${CDN}/ForBiggerMeltdowns.mp4`, // TODO: replace
    fullSrc: `${CDN}/ForBiggerMeltdowns.mp4`, // TODO: replace
  },
  {
    id: "halo-ad",
    title: "Halo — Spring Drop",
    client: "Halo Beauty",
    category: "ads",
    year: 2024,
    aspectRatio: "4:5",
    poster: poster("halo-ad"),
    previewSrc: `${CDN}/ForBiggerBlazes.mp4`, // TODO: replace
    fullSrc: `${CDN}/ForBiggerBlazes.mp4`, // TODO: replace
  },
  {
    id: "drift-ugc",
    title: "Drift — Unboxed",
    client: "Drift Audio",
    category: "ugc",
    year: 2025,
    aspectRatio: "1:1",
    poster: poster("drift-ugc"),
    previewSrc: `${CDN}/WeAreGoingOnBullrun.mp4`, // TODO: replace
    fullSrc: `${CDN}/WeAreGoingOnBullrun.mp4`, // TODO: replace
  },
  {
    id: "atlas-marketing",
    title: "Atlas — Series A Film",
    client: "Atlas Cloud",
    category: "marketing",
    year: 2024,
    aspectRatio: "16:9",
    poster: poster("atlas-marketing"),
    previewSrc: `${CDN}/ElephantsDream.mp4`, // TODO: replace
    fullSrc: `${CDN}/ElephantsDream.mp4`, // TODO: replace
  },
  {
    id: "nova-hyper",
    title: "Nova — Speed Reel",
    client: "Nova Motors",
    category: "hyper",
    year: 2025,
    aspectRatio: "16:9",
    poster: poster("nova-hyper"),
    previewSrc: `${CDN}/SubaruOutbackOnStreetAndDirt.mp4`, // TODO: replace
    fullSrc: `${CDN}/SubaruOutbackOnStreetAndDirt.mp4`, // TODO: replace
  },
  {
    id: "ember-ad",
    title: "Ember — Holiday",
    client: "Ember Home",
    category: "ads",
    year: 2024,
    aspectRatio: "4:5",
    poster: poster("ember-ad"),
    previewSrc: `${CDN}/ForBiggerEscapes.mp4`, // TODO: replace
    fullSrc: `${CDN}/ForBiggerEscapes.mp4`, // TODO: replace
  },
  {
    id: "prism-3d",
    title: "Prism — Logo System",
    client: "Prism",
    category: "vfx",
    year: 2025,
    aspectRatio: "1:1",
    poster: poster("prism-3d"),
    previewSrc: `${CDN}/BigBuckBunny.mp4`, // TODO: replace
    fullSrc: `${CDN}/BigBuckBunny.mp4`, // TODO: replace
  },
];

/** The hero showreel + the lightbox "Watch the reel" source. */
export const SHOWREEL = {
  poster: "/posters/showreel.svg", // TODO: replace with real AdventHQ asset
  src: `${CDN}/ForBiggerJoyrides.mp4`, // TODO: replace with real AdventHQ showreel
};

export const featuredProjects = projects.filter((p) => p.featured);
