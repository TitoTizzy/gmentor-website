import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://gaellementor.com',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
  security: { checkOrigin: true },
  vite: {
    build: { cssMinify: true }
  }
});
