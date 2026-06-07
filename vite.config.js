import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base path to match the GitHub Pages sub-directory name
  base: '/official/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        minimalist_light: './index_minimalist_light.html',
        warm_editorial: './index_warm_editorial.html',
        professional_saas_light: './index_professional_saas_light.html',
        feed: './feed.html',
        report: './report.html',
        contact: './contact.html',
        donate: './donate.html',
        complaint: './complaint_reports.html',
        generate: './generate_report.html',
        fixcontact: './fixmyarea+contact.html',
        fixdonate: './fixmyarea+donation.html',
        register: './register.html',
      }
    },
    outDir: 'dist',
  }
});
