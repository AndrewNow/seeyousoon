import { defineConfig } from "astro/config";
import { sanityIntegration as sanity } from "@sanity/astro";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [
    sanity({
      projectId: "gt0shs9f",
      dataset: "production",
      apiVersion: "2024-01-22",
      useCdn: true,
    }),
  ],
});
