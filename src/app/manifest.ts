import type { MetadataRoute } from "next";

// The icons are the marketing site's, copied as-is: the glyph on a midnight
// tile, full bleed with the glyph inside the maskable safe zone, so one PNG
// serves both purposes. Colours are the Continuity paper hex hand-off, the
// same as the light `theme-color` in the root layout.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stunt Double Docs",
    short_name: "Stunt Double",
    description:
      "Learn how Stunt Double works: create AI actors, automate verification checklists, run user interviews, and drive it all from the API.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafd",
    theme_color: "#f8fafd",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["productivity", "developer"],
  };
}
