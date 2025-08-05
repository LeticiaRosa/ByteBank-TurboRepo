import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Environment Variables', env)

  const isProduction = mode === 'production'
  const authUrl = isProduction ? env.VITE_AUTH_MFE_URL : 'http://localhost:3001'

  return {
    base: isProduction ? env.VITE_MENU_BASE_URL : 'http://localhost:3002',
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
        name: 'mfe-menu',
        filename: 'remoteEntry.js',
        manifest: true,
        exposes: {
          './dashboard': './src/AppRouter.tsx',
        },
        remotes: {
          auth: {
            type: 'module',
            name: 'auth',
            entry: `${authUrl}/remoteEntry.js`,
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
          '@tanstack/react-router': {
            requiredVersion: '^1.130.2',
            singleton: true,
          },
          '@tanstack/react-query': {
            requiredVersion: '^5.66.5',
            singleton: true,
          },
        },
      }),
    ],
    server: {
      port: 3002,
      strictPort: true,
    },
    preview: {
      port: 3002,
      strictPort: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    build: {
      target: 'esnext',
      minify: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  }
})
