/**
 * Trust-strip / marquee content, plus testimonials, process steps and stats.
 */

/** Capability keywords for the velocity marquee. */
export const capabilities: string[] = [
  "Ads",
  "Product Films",
  "3D",
  "VFX",
  "Titles",
  "UGC",
  "Hyper Motion",
  "Marketing",
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "AdventHQ took a brief we'd struggled to articulate for months and turned it into the best film our brand has ever shipped. The craft is unreal.",
    name: "Maya Chen",
    role: "VP Brand, Aurora Athletics",
  },
  {
    quote:
      "Every frame felt intentional. They move fast without ever cutting a corner — rare combination, and it shows in the numbers.",
    name: "Daniel Reyes",
    role: "Head of Growth, Flux Labs",
  },
  {
    quote:
      "Our title sequence is the thing people screenshot. That's all AdventHQ. We'll bring them every season.",
    name: "Priya Nair",
    role: "Showrunner, NYX Studios",
  },
  {
    quote:
      "They understand motion as a language, not a decoration. The work converted better than anything we'd tested before.",
    name: "Tom Whitaker",
    role: "CMO, Atlas Cloud",
  },
];

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "We dig into the brief, the audience, and the metric that actually matters — then agree on what success looks like before a single frame moves.",
  },
  {
    index: "02",
    title: "Direct",
    description:
      "Boards, style frames, and a clear creative direction. You sign off on the vision with zero ambiguity about where we're headed.",
  },
  {
    index: "03",
    title: "Animate",
    description:
      "Design, 3D, and motion come together in tight review loops. You see real progress weekly, never a black-box reveal at the end.",
  },
  {
    index: "04",
    title: "Deliver",
    description:
      "Final masters, every platform size, source files, and a kit for your team. Delivered on time, built to keep performing.",
  },
];

export const studioStats = [
  { label: "Projects shipped", value: 240, suffix: "+" },
  { label: "Frames rendered", value: 9.4, suffix: "M" },
  { label: "Avg. turnaround", value: 21, suffix: " days" },
  { label: "Client retention", value: 94, suffix: "%" },
];
