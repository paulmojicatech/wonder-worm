import { defineConfig } from 'astro/config';
import aws from "@astrojs-aws/adapter"

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: aws()
});
