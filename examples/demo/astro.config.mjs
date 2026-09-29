import { defineConfig } from 'astro/config';
import mori from 'astro-mori';
import moriConfig from './mori.config.ts';

export default defineConfig({
  integrations: [mori(moriConfig)],
});
