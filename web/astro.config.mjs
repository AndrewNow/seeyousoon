import { defineConfig } from "astro/config";
import { sanityIntegration } from "@sanity/astro";
// import vercel from '@astrojs/vercel/serverless';
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  // adapter: vercel({
  //   edgeMiddleware: true,
  //   maxDuration: 8
  // }),
  integrations: [
    sanityIntegration({
      projectId: "gt0shs9f",
      dataset: "production",
      apiVersion: "2024-01-22",
      useCdn: true,
    }),
  ],
});
