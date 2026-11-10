import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          academyTraining: path.resolve(__dirname, 'academy-training.html'),
          performanceCreatives: path.resolve(__dirname, 'performance-creatives.html'),
          corporatePartnerships: path.resolve(__dirname, 'corporate-partnerships.html'),
          labsWorkshops: path.resolve(__dirname, 'labs-workshops.html'),
          retreatsExperiences: path.resolve(__dirname, 'retreats-experiences.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
