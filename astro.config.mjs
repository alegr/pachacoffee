// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    assets: '_astro',
  },
});
