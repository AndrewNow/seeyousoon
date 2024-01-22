import { defineConfig } from 'astro/config';
// import sanity from "astro-sanity";
// import vercel from '@astrojs/vercel/serverless';

import sanity from "astro-sanity";

// https://astro.build/config
export default defineConfig({
  integrations: [sanity()]
});