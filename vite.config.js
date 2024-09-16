/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file is to set vite configuration (where root is and where to acess HTML files, and where built files should be placed)
Notes: Connected to ../../index.html
*/

import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Set this to the directory containing your HTML files
  build: {
    outDir: '../dist', // Output directory for built files, adjust as needed
    rollupOptions: {
      input: {
        main: 'index.html',
        calendar: "/Pages/CalendarPage.html",
        setting: "/Pages/SettingPage.html",
      }
    }
  }
});
