import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: false
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': JSON.stringify({ NODE_ENV: 'production' })
      }
    }),
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    json()
  ],
  external: ['react', 'react-dom', 'decky-frontend-lib']
};
