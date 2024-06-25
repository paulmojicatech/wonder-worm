import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

import analogjsangular from "@analogjs/astro-angular";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  integrations: [analogjsangular()]
});