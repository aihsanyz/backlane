import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  // Paket zaten "type": "module"; uzantiyi .js tutup exports ile hizali kalalim.
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
});
