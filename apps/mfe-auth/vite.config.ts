import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
      semicolons: false,
      autoCodeSplitting: true,
      enableRouteTreeFormatting: true,
    }),
    viteReact(),
    tailwindcss(),
    federation({
      name: 'mfe-auth',
      filename: 'remoteEntry.js',
      remotes: {
        dashboard: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: {
        react: {
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          requiredVersion: '^19.0.0',
        },
        '@tanstack/react-router': {
          requiredVersion: '^1.130.2',
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
