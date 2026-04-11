import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base path to match the GitHub Pages sub-directory name
  base: '/official/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        feed: './feed.html',
        report: './report.html',
        contact: './contact.html',
        donate: './donate.html',
        complaint: './complaint_reports.html',
        generate: './generate_report.html',
        verify: './verify_report.html',
      }
    },
    outDir: 'dist',
  }
});
