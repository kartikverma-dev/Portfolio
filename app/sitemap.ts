import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "/",
      lastModified: new Date("2026-10-18"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
