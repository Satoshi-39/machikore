import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

/**
 * Vite configuration for building the web editor into a single file
 * This will be used by the React Native WebView
 *
 * Based on TenTap's official vite.config.ts
 */
export default defineConfig({
  root: path.resolve(__dirname),
  build: {
    outDir: 'build',
    minify: 'esbuild',
    target: 'es2015',
  },
  resolve: {
    alias: [
      {
        // Web側では@10play/tentap-editor/webのみを使用
        find: '@10play/tentap-editor',
        replacement: '@10play/tentap-editor/web',
      },
      // Tiptapのバージョン競合を防ぐためのエイリアス
      // https://github.com/ueberdosis/tiptap/issues/3869#issuecomment-2167931620
      {
        find: '@tiptap/pm/view',
        replacement: '@10play/tentap-editor/web',
      },
      {
        find: '@tiptap/pm/state',
        replacement: '@10play/tentap-editor/web',
      },
      // React 18を使用（editor-web/node_modules内のReact 18）
      {
        find: /^react$/,
        replacement: path.resolve(__dirname, 'node_modules/react'),
      },
      {
        find: 'react/jsx-runtime',
        replacement: path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      },
      {
        find: 'react/jsx-dev-runtime',
        replacement: path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime'),
      },
      {
        find: /^react-dom$/,
        replacement: path.resolve(__dirname, 'node_modules/react-dom'),
      },
      {
        find: 'react-dom/client',
        replacement: path.resolve(__dirname, 'node_modules/react-dom/client'),
      },
    ],
  },
  plugins: [react(), viteSingleFile()],
  server: {
    port: 3000,
  },
  esbuild: {
    charset: 'ascii',
  },
});
