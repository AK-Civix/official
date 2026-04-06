import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base path to match the GitHub Pages sub-directory name
  base: '/official/',
  build: {
    // Ensure the output is clean
    outDir: 'dist',
  }
});
