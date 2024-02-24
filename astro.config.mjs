import { defineConfig } from 'astro/config';
import awsAmplify from '@astrojs/adapter-aws-amplify';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: awsAmplify()
});
