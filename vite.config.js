import { defineConfig } from 'vite';

export default defineConfig({
  base: '/official/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        minimalist_light: './index_minimalist_light.html',
        warm_editorial: './index_warm_editorial.html',
        professional_saas_light: './index_professional_saas_light.html',
        neo_brutalist: './index_neo_brutalist.html',
        feed: './feed.html',
        feed_blr: './feed-Bengaluru.html',
        feed_hyd: './feed-Hyderabad.html',
        feed_jam: './feed-Jamshedpur.html',
        feed_ken: './feed-Kendrapara.html',
        feed_pud: './feed-Puducherry.html',
        report: './report.html',
        report_blr: './report-Bengaluru.html',
        report_hyd: './report-Hyderabad.html',
        report_jam: './report-Jamshedpur.html',
        report_ken: './report-Kendrapara.html',
        report_pud: './report-Puducherry.html',
        report_pune: './report-Pune.html',
        contact: './contact.html',
        donate: './donate.html',
        complaint: './complaint_reports.html',
        generate: './generate_report.html',
        fixcontact: './fixmyarea+contact.html',
        fixdonate: './fixmyarea+donation.html',
        register: './register.html',
        city_blr: './city-Bengaluru.html',
        city_hyd: './city-Hyderabad.html',
        city_jam: './city-Jamshedpur.html',
        city_ken: './city-Kendrapara.html',
        city_pud: './city-Puducherry.html',
        city_pune: './city-Pune.html',
        code: './code.html',
      }
    },
    outDir: 'dist',
  }
});
