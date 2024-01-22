import { defineConfig } from 'astro/config';
import { sanityIntegration } from "@sanity/astro";
// import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // output: 'server',
  // adapter: vercel(),
  integrations: [
    sanityIntegration({
      projectId: 'gt0shs9f',
      dataset: 'production',
      apiVersion: '2024-01-22',
      useCdn: true,
    })
  ]
});