// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  site: 'https://quotegeneratorfree.com',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/500') &&
        !page.endsWith('/privacy/') &&
        !page.endsWith('/privacy') &&
        !page.endsWith('/terms-and-conditions/') &&
        !page.endsWith('/terms-and-conditions'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
