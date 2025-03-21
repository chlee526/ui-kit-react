import react from '@vitejs/plugin-react';
import { globSync } from 'glob';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import pkg from './package.json';

const externalDependencies = [...Object.keys(pkg?.peerDependencies || {}), ...Object.keys(pkg?.devDependencies || {})];

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
    const isProduction = mode === 'production';

    return {
        plugins: [nodePolyfills(), react(), libInjectCss(), dts({ exclude: ['**/*.stories.*', 'src/test', '**/*.test.tsx'] })],
        resolve: {
            // alias: [{ find: '@/', replacement: '/src/' }],
        },
        build: {
            lib: {
                entry: resolve(__dirname, 'src/main.ts'),
                formats: ['es'],
            },
            rollupOptions: {
                external: ['react', 'react-dom', 'react/jsx-runtime', ...externalDependencies],

                input: Object.fromEntries(
                    globSync(['src/*/*.tsx', 'src/main.ts']).map((file) => {
                        const entryName = path.relative('src', file.slice(0, file.length - path.extname(file).length));

                        const entryUrl = fileURLToPath(new URL(file, import.meta.url));
                        return [entryName, entryUrl];
                    }),
                ),
                output: {
                    entryFileNames: '[name].js',
                    assetFileNames: 'assets/[name][extname]',
                    globals: {
                        react: 'React',
                        'react-dom': 'React-dom',
                        'react/jsx-runtime': 'react/jsx-runtime',
                    },
                },
            },
            outDir: '@dist',
            minify: isProduction,
            sourcemap: !isProduction,
            target: 'esnext',
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
        },
    };
});
