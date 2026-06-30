import type { Category } from "./projects";

export type Service = {
  id: Category;
  index: string;
  title: string;
  description: string;
  deliverables: string[];
  /** Looping clip used as the service's ambient visual. */
  clip: string;
};

// TODO: replace with real AdventHQ asset CDN.
const CDN = "https://storage.googleapis.com/gtv-videos-bucket/sample";

export const services: Service[] = [
  {
    id: "ads",
    index: "01",
    title: "Ads & Product Films",
    description:
      "Hero films that make people stop, feel something, and remember the product. Built for the cut-down, sized for every platform.",
    deliverables: ["TVC / OLV", "Product films", "Social cut-downs", "Brand spots"],
    clip: `${CDN}/ForBiggerJoyrides.mp4`, // TODO: replace
  },
  {
    id: "vfx",
    index: "02",
    title: "3D & VFX / Titles",
    description:
      "Photoreal CG, procedural systems, and title design that gives a brand or a show its signature opening frame.",
    deliverables: ["3D / CGI", "Houdini FX", "Title sequences", "Compositing"],
    clip: `${CDN}/TearsOfSteel.mp4`, // TODO: replace
  },
  {
    id: "ugc",
    index: "03",
    title: "UGC Videos",
    description:
      "Native-feeling creator content with studio-grade polish under the hood — the authenticity of UGC, the consistency of a brand team.",
    deliverables: ["Creator content", "Vertical-first", "Hooks & variants", "Edits"],
    clip: `${CDN}/ForBiggerMeltdowns.mp4`, // TODO: replace
  },
  {
    id: "marketing",
    index: "04",
    title: "Marketing Videos",
    description:
      "Explainers, launch films, and performance creative that turn a complex story into something a viewer keeps watching.",
    deliverables: ["Explainers", "Launch films", "Performance ads", "Sizzles"],
    clip: `${CDN}/ForBiggerEscapes.mp4`, // TODO: replace
  },
  {
    id: "hyper",
    index: "05",
    title: "Hyper Motion Videos",
    description:
      "Beat-mapped, kinetic edits engineered for the first three seconds of a scroll. Maximum energy, zero wasted frames.",
    deliverables: ["Hyper cuts", "Beat-synced edits", "Kinetic type", "Reels / Shorts"],
    clip: `${CDN}/ForBiggerFun.mp4`, // TODO: replace
  },
];
