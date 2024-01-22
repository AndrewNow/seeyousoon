import { defineConfig } from "astro/config";
import { sanityIntegration } from "@sanity/astro";
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [
    sanityIntegration({
      projectId: "gt0shs9f",
      dataset: "production",
      apiVersion: "2024-01-22",
      useCdn: true,
    }),
  ],
});
