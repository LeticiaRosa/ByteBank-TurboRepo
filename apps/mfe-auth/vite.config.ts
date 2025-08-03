import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'http://localhost:3001',
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
      manifest: true,
      exposes: {
        './useAuth': './src/hooks/useAuth.ts',
      },
      remotes: {
        dashboard: {
          type: 'module',
          name: 'dashboard',
          entry: 'http://localhost:3002/remoteEntry.js',
        },
      },
      shared: {
        react: {
          requiredVersion: '^18.3.1',
          singleton: true,
        },
        'react-dom': {
          requiredVersion: '^18.3.1',
          singleton: true,
        },
        '@tanstack/react-query': {
          requiredVersion: '^5.84.1',
          singleton: true,
        },
        '@tanstack/react-router': {
          requiredVersion: '^1.130.2',
          singleton: true,
        },
      },
    }),
  ],
  server: {
    port: 3001,
    origin: 'http://localhost:3001',
    cors: true,
    strictPort: true,
  },
  preview: {
    port: 3001,
    strictPort: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
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
