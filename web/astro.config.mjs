import { defineConfig } from 'astro/config';
import { sanityIntegration } from "@sanity/astro";
import vercelServerless from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless(),
  integrations: [sanityIntegration({
    projectId: 'gt0shs9f',
    dataset: 'production',
    apiVersion: '2024-01-22',
    useCdn: true,
  })]
});