/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file is to set vite configuration (where root is and where to acess HTML files, and where built files should be placed)
Notes: Connected to ../../index.html
*/

import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // The root directory of project

  build: {
    outDir: 'dist', // Directory where build files will be output
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        calendar: path.resolve(__dirname, 'public/Pages/CalendarPage.html'),
        setting: path.resolve(__dirname, 'public/Pages/SettingPage.html'),
      },
    },
  },

  // To handle static assets
  publicDir: 'public',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

