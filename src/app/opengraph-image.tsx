import { OG_SIZE, renderOgCard } from "@/components/og-card";

// The site default card, rendered once at build. Each docs page uses its own
// card from `og/[...slug]` instead.
export const alt = "Stunt Double Docs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard({
    eyebrow: "Docs",
    title: "Stunt Double Docs",
    description:
      "Create actors, automate checklists, run user interviews, and drive it all from the API.",
  });
}
