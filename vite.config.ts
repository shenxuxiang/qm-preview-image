import path from 'path';
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import presetEnv from 'postcss-preset-env';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const define = Object.keys(env).reduce((memo: object, key: string) => {
    memo[key] = JSON.stringify(env[key]);
    return memo;
  }, {});

  return {
    define,
    plugins: [
      react(),
      legacy(),
      splitVendorChunkPlugin(),
    ],
    publicDir: 'public',
    css: {
      postcss: {
        plugins: [ presetEnv ],
      },
      preprocessorOptions: {
        less: {
          modifyVars: {},
          globalVars: {},
          additionalData: '',
          javascriptEnable: true,
        }
      },
      modules: {
        scopeBehaviour: 'local',
        globalModulePaths: [ /(?<!\.module)\.css$/, /(?<!\.module)\.less$/ ],
        hashPrefix: 'vite',
        localsConvention: 'camelCaseOnly'
      },
      devSourcemap: mode === 'development',
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
      alias: {
        '@': path.resolve('src'),
      }
    },
    build: {
      outDir: 'build',
      assetsDir: 'static',
      assetsInlineLimit: 10 * 1024,
      cssCodeSplit: true,
      cssMinify: true,
      sourcemap: 'hidden',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        }
      },
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo: any) => {
            const { name } = assetInfo;
            if (/\.(png|jpe?g|bmp|webp|gif|svg)$/.test(name)) {
              return "image/[name]-[hash][extname]";
            } else if (/\.(woff2|woff|eot|ttf)$/.test(name)) {
              return "font/[name]-[hash][extname]";
            } else if (/\.css$/.test(name)) {
              return "css/[name]-[hash][extname]";
            } else {
              return "[ext]/[name]-[hash][extname]";
            }
          },
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].chunk.js',
          manualChunks: {
            'vendor-react': [ 'react', 'react-dom' ],
          }
        }
      }
    },
    server: {
      hmr: true,
      open: true,
      port: 9999,
      strictPort: true,
      host: 'localhost',
    }
  };
})
