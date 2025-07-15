import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';

import analogjsangular from "@analogjs/astro-angular";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), analogjsangular()]
});