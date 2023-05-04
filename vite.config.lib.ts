import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import presetEnv from 'postcss-preset-env';
import libcss from 'vite-plugin-libcss';
export default defineConfig({
  plugins: [
    libcss()
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
    alias: {
      '@': path.resolve('src'),
    }
  },
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
    devSourcemap: true,
  },
  build: {
    copyPublicDir: false,
    // emptyOutDir: true,
    outDir: 'lib',
    cssCodeSplit: false,
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve('src/components/PreviewImage/index.tsx'),
      name: 'PreviewImage',
      // the proper extensions will be added
      fileName: 'qm-preview-image',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'react': 'react',
          'react-dom': 'react-dom',
        },
      },
    },
    sourcemap: true,
  },
})

