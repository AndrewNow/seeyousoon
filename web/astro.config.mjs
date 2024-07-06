import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro'
import netlify from '@astrojs/netlify';
// import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify({
    edgeMiddleware: true,
    imageCDN: false, // disable this to serve sanity images
  }),
  image: {
    domains: ['cdn.sanity.io', 'astro.build'],
  },
  integrations: [
    // react(),
    sanity({
      projectId: "gt0shs9f",
      dataset: "production",
      apiVersion: "2024-01-22",
      useCdn: true, // set to false if building statically
    }),
  ],
});
